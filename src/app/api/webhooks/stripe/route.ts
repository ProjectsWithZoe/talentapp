import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const CREDIT_PRICE_MAP: Record<string, number> = {
  [env.STRIPE_CREDIT_PRICE_ID_1CREDIT]: 1,
  [env.STRIPE_CREDIT_PRICE_ID_3PACK]: 3,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;

    if (!email) return NextResponse.json({ received: true });

    const priceType = session.metadata?.priceType;
    const metadataCredits = session.metadata?.credits ? parseInt(session.metadata.credits, 10) : null;

    if (priceType === "credit" && metadataCredits) {
      // API checkout — trust metadata
      await upsertCredits(email, metadataCredits);
    } else if (priceType === "lifetime") {
      await setLifetime(email);
    } else {
      // Payment link — no metadata, check price ID from line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      const priceId = lineItems.data[0]?.price?.id;

      if (priceId && CREDIT_PRICE_MAP[priceId] !== undefined) {
        await upsertCredits(email, CREDIT_PRICE_MAP[priceId]);
        await sendMagicLink(email);
      } else {
        await setLifetime(email);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function upsertCredits(email: string, creditCount: number) {
  // Upsert: create user if not exists, otherwise increment credits
  await db
    .insert(user)
    .values({
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      emailVerified: false,
      tier: "free",
      freeReportUsed: false,
      credits: creditCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: user.email,
      set: {
        credits: sql`${user.credits} + ${creditCount}`,
        updatedAt: new Date(),
      },
    });
}

async function sendMagicLink(email: string) {
  try {
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: `${env.NEXT_PUBLIC_APP_URL}/analyze`,
      },
      headers: new Headers({
        origin: env.NEXT_PUBLIC_APP_URL,
        host: new URL(env.NEXT_PUBLIC_APP_URL).host,
      }),
    });
  } catch (err) {
    console.error("Failed to send magic link after credit purchase:", err);
  }
}

async function setLifetime(email: string) {
  const result = await db
    .update(user)
    .set({ tier: "lifetime", updatedAt: new Date() })
    .where(eq(user.email, email));

  if (result.rowCount === 0) {
    console.log(`Stripe webhook: no user for ${email} — success page will handle creation`);
  }
}
