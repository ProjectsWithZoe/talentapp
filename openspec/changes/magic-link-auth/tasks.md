## 1. Dependencies & Environment

- [x] 1.1 Install `resend` package (`npm install resend`)
- [x] 1.2 Add `RESEND_API_KEY` to `src/env.ts` Zod schema (server-only, required)
- [x] 1.3 Add `RESEND_API_KEY` to `.env.local` (and document in README/CLAUDE.md)

## 2. Server Auth Config

- [x] 2.1 Remove `emailAndPassword` and `socialProviders` (Google) from `src/lib/auth.ts`
- [x] 2.2 Add `magicLink` plugin to better-auth config with Resend `sendMagicLink` handler
- [x] 2.3 Verify `verification` table is present in Drizzle schema (better-auth uses it for tokens) — run `npm run db:push` if schema needs updating

## 3. Client Auth Config

- [x] 3.1 Update `src/lib/auth-client.ts` to expose `magicLinkClient` plugin and remove any password-related exports

## 4. Auth Modal UI

- [x] 4.1 Create `src/components/auth-modal.tsx` — modal with email input form (shadcn Dialog + Input + Button)
- [x] 4.2 Add "check your inbox" confirmation state shown after magic link is sent
- [x] 4.3 Add "resend link" action in confirmation state
- [x] 4.4 Wire form submit to `authClient.signIn.magicLink({ email, callbackURL })`
- [x] 4.5 Handle and display error states (invalid email, send failure)

## 5. Integration

- [x] 5.1 Ensure the auth modal is triggered when an unauthenticated user attempts to run an analysis on `/analyze`
- [x] 5.2 Verify the magic link callback (`/api/auth/magic-link/verify`) redirects correctly back to the originating page
- [x] 5.3 Verify session is available via `useSession()` after callback redirect

## 6. Cleanup

- [x] 6.1 Remove any sign-up/sign-in pages or components that were tied to email/password flow
- [x] 6.2 Run `npm run lint` and `npm run build` — fix any type errors or lint warnings
