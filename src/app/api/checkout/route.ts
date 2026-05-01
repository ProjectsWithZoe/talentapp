import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: process.env.STRIPE_LIFETIME_PRICE_ID!,
        quantity: 1,
      },
    ],
    customer_email: session.user.email,
    automatic_tax: { enabled: true },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/analyze`,
    metadata: { userId: session.user.id },
  });

  return NextResponse.redirect(checkoutSession.url!, 303);
}

export async function GET(req: NextRequest) {
  return POST(req);
}
