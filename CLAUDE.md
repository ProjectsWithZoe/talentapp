# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**TalentApp.co.uk** — AI-powered resume analyzer for tech job seekers. Users upload a resume + job description, and Claude returns an ATS score, recruiter fit rating, match/gap analysis, and improvement fixes. The first analysis is free with no account required (cookie-gated); subsequent analyses require sign-in. Lifetime users (£99 one-time via Stripe) get unlimited analyses plus `optimizedBullets`.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # ESLint

npm run db:generate  # Generate Drizzle migrations from schema
npm run db:push      # Push schema to database (no migration file)
npm run db:studio    # Open Drizzle Studio (DB browser)

npm run test:e2e                                          # Run all Playwright tests
npm run test:e2e:ui                                       # Playwright interactive UI
npx playwright test tests/smoke.spec.ts                   # Single test file
npx playwright test --grep "free warning modal"           # Tests matching a pattern
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 19
- **Auth**: better-auth with Drizzle adapter — magic link only (no password, no OAuth)
- **Database**: Neon Postgres via `@neondatabase/serverless` + Drizzle ORM
- **AI**: Vercel AI SDK v4 (`generateObject`) → Claude Sonnet 4.6
- **Payments**: Stripe one-time checkout (no subscriptions); three products: lifetime, 1-credit, 3-credit pack
- **Blog/Content**: Sanity CMS
- **State**: Zustand client store for analysis result only — analysis results are never persisted to the database
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS

### Key Data Flow

**Analysis request** (`/api/analyze`):
1. Rate limiter check (`src/proxy.ts`) — 5 req/60 s per IP via `x-forwarded-for`
2. **Guest path** (no session): check `talent_free_used` cookie → if present, 403; otherwise run analysis (no `optimizedBullets`), set cookie on response
3. **Authenticated path**: tier/entitlement check (`freeReportUsed` flag or `credits` > 0)
4. `generateObject()` with `analysisSchema` (Zod) → Claude; retries once without `optimizedBullets` on failure
5. For free users: `freeReportUsed = true` written to DB only after successful completion
6. Result returned to client, stored in Zustand — never in DB

**Guest → auth upgrade flow** (frontend, `src/app/analyze/page.tsx`):
- Guest submits → `FreeWarningModal` (guest copy: "no account needed") → analysis runs
- Guest tries again → API returns 403 → `AuthModal` shown ("Sign in to run more analyses")
- Signed-in free user, first analysis → `FreeWarningModal` (account copy: "Your free account includes") → analysis runs
- Signed-in exhausted user → API 403 → `UpgradeModal` (payment options)
- Signed-in lifetime user → no modal, goes straight to analysis

**Resume parsing** (dual strategy):
- `.docx` → mammoth, browser-side
- `.pdf` → `/api/parse-pdf` (server-side unpdf), then result sent to `/api/analyze`

**Tier gating**:
- `user.tier` enum: `"free"` | `"lifetime"`
- `user.freeReportUsed` boolean: blocks second free analysis for signed-in users
- `user.credits` integer: per-analysis credits bought via Stripe
- `optimizedBullets` is `null` in the Claude response for free/guest users (system prompt instructs this)
- Stripe webhook (`checkout.session.completed`) upgrades tier to `"lifetime"` or increments `credits`

### Important Files

| File | Purpose |
|---|---|
| `src/proxy.ts` | Rate limiter: 5 req/60 s per IP on `/api/analyze` (in-memory Map, keyed by `x-forwarded-for`) |
| `src/lib/auth.ts` | better-auth server config (magic link plugin, DB adapter, extra user fields) |
| `src/lib/auth-client.ts` | Client-side auth exports (`signOut`, `useSession`) |
| `src/db/schema.ts` | Drizzle schema — `user`, `session`, `account`, `verification` tables |
| `src/lib/analysis-schema.ts` | Zod schema Claude's response is validated against |
| `src/lib/prompts.ts` | System prompt + analysis prompt builder |
| `src/lib/generate-pdf.ts` | Client-side jsPDF report generation from in-memory analysis result |
| `src/store/analysis.ts` | Zustand store — single source of truth for analysis result on client |
| `src/env.ts` | Zod env validation — throws at startup if any required var is missing |

### API Routes

| Route | Method | Notes |
|---|---|---|
| `/api/analyze` | POST | Guest-friendly (cookie gate) + authenticated. Rate-limited via `src/proxy.ts`. |
| `/api/parse-pdf` | POST | Server-side PDF extraction. 5 MB max. No auth required. |
| `/api/auth/[...all]` | GET/POST | better-auth handler — do not modify directly |
| `/api/checkout` | POST/GET | Creates Stripe checkout session. Auth required. |
| `/api/webhooks/stripe` | POST | Verifies Stripe signature, upgrades tier/credits on `checkout.session.completed` |
| `/api/activate` | POST | Post-payment activation via `session_id`. Upserts user to lifetime, sends magic link if not signed in. |
| `/api/contact` | POST | Contact form — validates with Zod, sends via Resend. |
| `/api/og` | GET | OG image via `@vercel/og`. **Broken in `next dev`** (edge runtime WASM issue); works in production. |

### Environment Variables

All validated at startup via `src/env.ts`. Missing variables crash the server — this is intentional.

```
DATABASE_URL                               # Neon Postgres
BETTER_AUTH_SECRET                         # ≥32 chars
BETTER_AUTH_URL                            # Auth origin (matches app URL)
ANTHROPIC_API_KEY                          # sk-ant-*
STRIPE_SECRET_KEY                          # sk_*
STRIPE_WEBHOOK_SECRET                      # whsec_*
STRIPE_LIFETIME_PRICE_ID                   # price_*
STRIPE_CREDIT_PRICE_ID_1CREDIT             # price_*
STRIPE_CREDIT_PRICE_ID_3PACK               # price_*
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME   # https://buy.stripe.com/*
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_1CREDIT    # https://buy.stripe.com/*
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_3CREDITS   # https://buy.stripe.com/*
RESEND_API_KEY                             # re_*
NEXT_PUBLIC_APP_URL                        # Client-visible app URL
NEXT_PUBLIC_SANITY_PROJECT_ID              # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET                 # Sanity dataset name
SANITY_API_TOKEN                           # Sanity API token
```

### Test Suite

Tests live in `tests/`. `playwright.config.ts` auto-starts the dev server if not already running.

| File | Covers |
|---|---|
| `tests/smoke.spec.ts` | Landing page, analyze page structure, results redirect, blog, contact |
| `tests/auth-flow.spec.ts` | Guest vs signed-in analysis flows, modal routing per user state |
| `tests/api.spec.ts` | All API routes — input validation, auth guards, cookie gate, rate limiter isolation |
| `tests/payments.spec.ts` | Stripe payment links, upgrade modal UI, webhook signature validation |

Analyze API tests pass a unique `x-forwarded-for` header per test to avoid sharing the in-memory rate-limit bucket across test runs.

## Development Workflow (OpenSpec)

This project uses [OpenSpec](https://openspec.dev) for spec-driven changes. Config in `openspec/config.yaml`.

| Command | Purpose |
|---|---|
| `/opsx:new` | Start a new change (feature, fix, refactor) |
| `/opsx:explore` | Think through a problem before committing |
| `/opsx:propose` | Generate all artifacts for a new change |
| `/opsx:ff` | Fast-forward: create change + all artifacts in one step |
| `/opsx:continue` | Resume work on an in-progress change |
| `/opsx:apply` | Implement tasks from a change |
| `/opsx:verify` | Verify implementation matches artifacts |
| `/opsx:archive` | Archive a completed change |
| `/opsx:onboard` | Guided walkthrough of the full OpenSpec workflow |
