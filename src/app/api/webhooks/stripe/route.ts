import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;

    if (!email) {
      return NextResponse.json({ received: true });
    }

    const result = await db
      .update(user)
      .set({ tier: "lifetime", updatedAt: new Date() })
      .where(eq(user.email, email));

    if (result.rowCount === 0) {
      // User doesn't exist yet — the /success page handles creation.
      // This is expected when someone pays via the unauthenticated Payment Link
      // before their account is created. Log and move on; the success page is primary.
      console.log(`Stripe webhook: no existing user for email ${email} — skipping (success page handles creation)`);
    }
  }

  return NextResponse.json({ received: true });
}
