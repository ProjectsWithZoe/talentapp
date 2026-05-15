import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type CheckoutType = "lifetime" | "credit1" | "credit3";

const CREDIT_COUNTS: Record<CheckoutType, number> = {
  lifetime: 0,
  credit1: 1,
  credit3: 3,
};

async function createCheckout(req: NextRequest, type: CheckoutType) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId =
    type === "credit1" ? env.STRIPE_CREDIT_PRICE_ID_1CREDIT :
    type === "credit3" ? env.STRIPE_CREDIT_PRICE_ID_3PACK :
    env.STRIPE_LIFETIME_PRICE_ID;

  const successUrl = type !== "lifetime"
    ? `${env.NEXT_PUBLIC_APP_URL}/analyze`
    : `${env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: session.user.email,
    automatic_tax: { enabled: true },
    success_url: successUrl,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/analyze`,
    metadata: {
      userId: session.user.id,
      priceType: type !== "lifetime" ? "credit" : "lifetime",
      credits: String(CREDIT_COUNTS[type]),
    },
  });

  return NextResponse.redirect(checkoutSession.url!, 303);
}

function parseType(raw: string | null): CheckoutType {
  if (raw === "credit1" || raw === "credit") return "credit1";
  if (raw === "credit3") return "credit3";
  return "lifetime";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return createCheckout(req, parseType(body.type ?? null));
}

export async function GET(req: NextRequest) {
  return createCheckout(req, parseType(req.nextUrl.searchParams.get("type")));
}
