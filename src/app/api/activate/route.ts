import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/env";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const session_id: string | undefined = body?.session_id;

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // Verify payment with Stripe — never trust the session_id alone
  let stripeSession: Stripe.Checkout.Session;
  try {
    stripeSession = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  if (stripeSession.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const email = stripeSession.customer_details?.email ?? stripeSession.customer_email;
  if (!email) {
    return NextResponse.json({ error: "No email on Stripe session" }, { status: 400 });
  }

  // Idempotency check — if already lifetime, skip all work
  const existing = await db.select().from(user).where(eq(user.email, email)).limit(1);
  if (existing.length > 0 && existing[0].tier === "lifetime") {
    const authSession = await auth.api.getSession({ headers: req.headers });
    return NextResponse.json({
      alreadyActivated: true,
      isSignedIn: !!authSession,
      email,
    });
  }

  // Upsert: upgrade existing user or create new one
  if (existing.length > 0) {
    await db
      .update(user)
      .set({ tier: "lifetime", updatedAt: new Date() })
      .where(eq(user.email, email));
  } else {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      emailVerified: false,
      tier: "lifetime",
      freeReportUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Check whether this request comes from a signed-in user
  const authSession = await auth.api.getSession({ headers: req.headers });
  const isSignedIn = !!authSession;

  // Send magic link for users who aren't signed in so they can access their account
  if (!isSignedIn) {
    try {
      await auth.api.signInMagicLink({
        body: {
          email,
          callbackURL: `${env.NEXT_PUBLIC_APP_URL}/analyze`,
        },
        headers: req.headers,
      });
    } catch (err) {
      // Non-fatal — user can request a new magic link from the sign-in page
      console.error("Failed to send magic link after payment:", err);
    }
  }

  // Send purchase confirmation email to everyone (non-fatal — tier upgrade already committed)
  try {
    await resend.emails.send({
      from: "TalentApp Admin <admin@talentapp.co.uk>",
      to: email,
      subject: "You're now a TalentApp Lifetime member",
      html: confirmationEmailHtml(email, isSignedIn),
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  return NextResponse.json({ activated: true, isSignedIn, email });
}

function confirmationEmailHtml(email: string, isSignedIn: boolean): string {
  const analyzeUrl = `${env.NEXT_PUBLIC_APP_URL}/analyze`;
  const nextStep = isSignedIn
    ? `<p>Head straight to <a href="${analyzeUrl}">your dashboard</a> to run your next analysis.</p>`
    : `<p>We've sent you a separate sign-in link. Click it to access your account — no password needed.</p>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:24px;margin-bottom:8px">You're Lifetime. 🎉</h1>
  <p style="color:#555;margin-top:0">Thanks for supporting TalentApp — you now have unlimited analyses, optimised bullet points, and every future feature, forever.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p><strong>What you've unlocked:</strong></p>
  <ul style="padding-left:20px;line-height:1.8">
    <li>Unlimited resume analyses</li>
    <li>AI-optimised bullet points</li>
    <li>All future features</li>
  </ul>
  ${nextStep}
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="font-size:12px;color:#999">
    Questions? Reply to this email or write to
    <a href="mailto:admin@zoebuilds.co.uk" style="color:#999">admin@zoebuilds.co.uk</a>.<br>
    TalentApp · ${email}
  </p>
</body>
</html>`;
}
