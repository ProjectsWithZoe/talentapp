# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**TalentApp.co.uk** — AI-powered resume analyzer for tech job seekers. Users upload a resume + job description, and Claude returns an ATS score, recruiter fit rating, match/gap analysis, and improvement fixes. Free users get one analysis; lifetime users (£99 one-time via Stripe) get unlimited analyses plus `optimizedBullets`.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint

npm run db:generate  # Generate Drizzle migrations from schema
npm run db:push      # Push schema to database (no migration file)
npm run db:studio    # Open Drizzle Studio (DB browser)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 19
- **Auth**: better-auth with Drizzle adapter — email/password only (no OAuth providers)
- **Database**: Neon Postgres via `@neondatabase/serverless` + Drizzle ORM
- **AI**: Vercel AI SDK (`generateObject`) → Claude Sonnet 4.6
- **Payments**: Stripe one-time checkout (no subscriptions)
- **State**: Zustand client store for analysis result only — analysis results are never persisted to the database
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS

### Key Data Flow

**Analysis request** (`/api/analyze`):
1. Auth check → tier/entitlement check (`freeReportUsed` flag)
2. `generateObject()` with `analysisSchema` (Zod) → Claude
3. `freeReportUsed = true` written to DB only after successful completion
4. If `optimizedBullets` fails, retries without them
5. Result returned to client, stored in Zustand — never in DB

**Resume parsing** (dual strategy):
- `.docx` → mammoth, browser-side
- `.pdf` → `/api/parse-pdf` (server-side unpdf), then result sent to `/api/analyze`

**Tier gating**:
- `user.tier` enum: `"free"` | `"lifetime"`
- `user.freeReportUsed` boolean: blocks second free analysis
- `optimizedBullets` is `null` in the Claude response for free users (system prompt instructs this)
- Stripe webhook (`checkout.session.completed`) sets `tier = "lifetime"` by email

### Important Files

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | better-auth server config (email/password, DB adapter, extra user fields) |
| `src/lib/auth-client.ts` | Client-side auth exports (`signIn`, `signUp`, `signOut`, `useSession`) |
| `src/db/schema.ts` | Drizzle schema — `user`, `session`, `account`, `verification` tables |
| `src/lib/analysis-schema.ts` | Zod schema Claude's response is validated against |
| `src/lib/prompts.ts` | System prompt + analysis prompt builder (role: recruiter + ATS + hiring manager) |
| `src/lib/generate-pdf.ts` | Client-side jsPDF report generation from in-memory analysis result |
| `src/store/analysis.ts` | Zustand store — single source of truth for analysis result on client |
| `src/middleware.ts` | Rate limiter: 5 req/60 s per IP on `/api/analyze` (in-memory Map) |
| `src/env.ts` | Zod env validation — throws at startup if any required var is missing |

### API Routes

| Route | Method | Notes |
|---|---|---|
| `/api/analyze` | POST | Auth required, rate-limited. Core analysis endpoint. |
| `/api/parse-pdf` | POST | Server-side PDF extraction. 5 MB max. |
| `/api/auth/[...all]` | GET/POST | better-auth handler — do not modify directly |
| `/api/checkout` | POST/GET | Creates Stripe one-time checkout session |
| `/api/webhooks/stripe` | POST | Verifies signature, upgrades tier on `checkout.session.completed` |
| `/api/og` | GET | OG image generation via `@vercel/og` |

### Environment Variables

All validated at startup via `src/env.ts`. Missing variables crash the server — this is intentional.

```
DATABASE_URL             # Neon Postgres
BETTER_AUTH_SECRET       # ≥32 chars
BETTER_AUTH_URL          # Auth origin (matches app URL)
ANTHROPIC_API_KEY        # sk-ant-*
STRIPE_SECRET_KEY        # sk_*
STRIPE_WEBHOOK_SECRET    # whsec_*
STRIPE_LIFETIME_PRICE_ID # price_*
RESEND_API_KEY           # re_* — magic link email delivery
NEXT_PUBLIC_APP_URL      # Client-visible app URL
```

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
