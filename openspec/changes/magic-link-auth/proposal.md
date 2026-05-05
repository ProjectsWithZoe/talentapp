## Why

The app currently has no working authentication flow wired up. Users need a dead-simple way to sign up and log in without managing passwords — a magic link sent to their email is the lowest-friction path that still gates the free/lifetime tier.

## What Changes

- Replace email/password auth config in better-auth with magic-link (OTP email) only
- Add a single auth UI modal/page with an email input that triggers the magic-link flow
- Wire the magic-link callback route into the existing better-auth handler
- Remove any password-related UI, fields, or API surface

## Capabilities

### New Capabilities

- `magic-link-auth`: Email-based passwordless sign-in/sign-up via better-auth's magic link plugin — single email input, link sent, user lands authenticated

### Modified Capabilities

_(none — no existing spec files to delta)_

## Impact

- `src/lib/auth.ts`: add `magicLink` plugin, remove `emailAndPassword`
- `src/lib/auth-client.ts`: expose `signIn.magicLink` client method
- New UI component: email input form + "check your inbox" confirmation state
- `src/app/api/auth/[...all]/route.ts`: no changes needed (handler is generic)
- `DATABASE_URL` / `BETTER_AUTH_SECRET` env vars already required — no new vars beyond an email transport (Resend or SMTP)
- Dependency: may need `resend` or a nodemailer adapter for sending magic link emails
