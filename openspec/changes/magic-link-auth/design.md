## Context

better-auth is already scaffolded in `src/lib/auth.ts` with email/password and Google OAuth. Neither flow is wired to a UI. The goal is to strip everything down to a single magic-link flow: user enters their email, receives a time-limited link, clicks it, and is authenticated. better-auth ships a `magicLink` plugin that handles token generation, storage, and verification — we just need to configure it and build one small UI.

## Goals / Non-Goals

**Goals:**
- Passwordless sign-in/sign-up via email magic link
- Single email-input UI (modal pattern, no page navigation) consistent with existing auth modal intent
- Works for both new and returning users in the same flow
- Email delivery via Resend (already common in the Next.js/better-auth ecosystem)

**Non-Goals:**
- Google OAuth (removed for now — can be added later)
- Email/password (removed entirely)
- "Remember me" or session duration customization
- Email template branding beyond minimal viable

## Decisions

**1. Use better-auth `magicLink` plugin over rolling a custom OTP**
better-auth's plugin handles token generation, hashing, expiry, and the callback verification route automatically. The only custom code needed is sending the email. Alternative (custom TOTP/OTP) would require more code and more surface area.

**2. Resend for email delivery**
Resend has a generous free tier (3,000 emails/month), a clean Node.js SDK, and works well with Vercel serverless. Alternative (nodemailer + SMTP) requires more config and credential management.

**3. Keep auth in a modal, not a dedicated page**
The CLAUDE.md notes auth uses a modal to preserve `/analyze` form state. Magic link doesn't change this — the email form and "check your inbox" state both live in the modal. The callback URL (`/api/auth/magic-link/verify`) redirects back to the originating page via a `callbackURL` param.

**4. Single `RESEND_API_KEY` env var — no new schema changes**
Magic link tokens are stored by better-auth in the existing `verification` table (already in the Drizzle schema). No new tables needed.

## Risks / Trade-offs

- **Email delivery delay** → Users may not receive the link instantly. Mitigation: show clear "check spam" guidance in the UI; Resend is reliable for transactional email.
- **Link expiry UX** → Expired links show an error. Mitigation: set a generous expiry (15 min default in better-auth) and surface a "resend" option in the UI.
- **No password fallback** → Users who previously used email/password can't log in that way. Mitigation: this is a fresh deployment with no existing users, so no migration concern.
- **Resend dependency** → Adds one external service. Mitigation: Resend free tier is sufficient for MVP; can swap transport later without changing better-auth config.
