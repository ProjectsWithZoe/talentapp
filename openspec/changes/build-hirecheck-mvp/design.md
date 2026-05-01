## Context

hirecheck.io is a greenfield Next.js App Router SaaS. There is no existing application code. The product allows tech job seekers to upload their resume and a job description and receive a structured AI analysis (ATS score, recruiter fit, missing skills, rejection risks, recruiter perception, fixes, and optional optimized bullet points).

The architecture must be stateless with respect to report content — no analysis data is persisted. User identity and entitlement (tier + free report usage) are persisted in Neon Postgres via better-auth.

## Goals / Non-Goals

**Goals:**
- Fully functional MVP: analyze → stream results → paywall upsell → Stripe Lifetime checkout
- Stateless analysis pipeline (reports generated on demand, never stored)
- Auth via better-auth with Google OAuth + email/password, using modal sign-in to preserve form state
- Single pricing tier: Lifetime at £99 (Stripe one-time payment)
- `optimizedBullets` exclusively for Lifetime users
- Shareable result card image via `@vercel/og`
- MDX blog for SEO at `/blog`
- File upload: `.docx` (mammoth, browser-side) + `.pdf` (unpdf, server-side)

**Non-Goals:**
- Report history / saved analyses
- Per-report pay-as-you-go billing (save for v2)
- Monthly subscription tier (save for v2)
- Mobile-first file upload experience (desktop-first for MVP)
- Real ATS system integrations (Workday, Taleo, Greenhouse)
- Team/org accounts
- Resume editing within the app

## Decisions

### 1. Next.js App Router with Server Components

Chosen over Pages Router for streaming support (RSC + `streamText`), built-in edge middleware, and `@vercel/og` edge image generation. Server Components handle auth session reads and DB queries without client round-trips.

Alternatives: Remix (no streaming RSC yet), SvelteKit (team familiarity lower).

### 2. better-auth for authentication

Self-hosted, zero vendor lock-in, full control over schema. Requires Neon Postgres but we need Postgres anyway for entitlement tracking. Supports Google OAuth and email/password out of the box.

Alternatives: Clerk (hosted, excellent DX, but vendor dependency and cost at scale); NextAuth v5 (free but more config, less polished).

Modal sign-in (not page redirect) is critical: Clerk makes this trivial; with better-auth we implement it via `better-auth/react` `signIn()` call inside a shadcn `<Dialog>`, keeping form state in React memory.

### 3. Drizzle ORM + Neon Postgres

Drizzle is the recommended ORM for better-auth and pairs well with Neon's serverless driver (`@neondatabase/serverless`). Schema is minimal: better-auth manages `users`, `sessions`, `accounts` tables; we add `tier` and `freeReportUsed` columns to `users`.

Alternatives: Prisma (heavier, slower cold starts on edge); raw SQL (no type safety).

### 4. Vercel AI SDK (`streamText`) for Claude integration

`streamText` from the AI SDK pipes Claude's response token-by-token to the client. The results page uses `useChat` / `readStreamableValue` to render analysis sections as they arrive — covering the 8–12s generation latency with a progressive reveal effect.

Claude is called with `tool_choice: { type: "tool" }` and a Zod schema to force valid structured JSON output. This eliminates ad-hoc JSON parsing failures from free-text responses.

Alternatives: Raw Anthropic SDK with manual streaming (more boilerplate, no built-in React hooks); batch (no streaming, worse perceived performance).

### 5. Stateless reports — no DB storage for analysis content

Reports are generated, streamed to the client, and never written to the database. Users cannot retrieve past reports. The free tier limit is enforced by `users.freeReportUsed boolean` — set to `true` after the first successful analysis API call completes.

Trade-off: users lose the report if they close the tab. Mitigated by: (a) warning modal before submission, (b) client-side PDF download available immediately on results page.

### 6. File parsing split: browser vs server

`.docx` files are parsed client-side via mammoth.js (browser build) before any API call. This avoids uploading raw files to the server and keeps the analysis API input clean (plain text).

`.pdf` files require server-side parsing via `unpdf` (edge-compatible, avoids the pdf-parse dependency). A dedicated `/api/parse-pdf` route accepts the file, extracts text, and returns it to the client. Both paths converge: the client sends `{ resumeText, jobDescription }` to `/api/analyze`.

Alternatives: Parse everything server-side (simpler but requires file upload for all formats); pdf-parse (user specifically excluded this).

### 7. Pricing: Free → Lifetime (£99), no subscription for MVP

A single Stripe Product with a one-time price. Stripe Checkout handles the payment; a webhook at `/api/webhooks/stripe` sets `users.tier = 'lifetime'` on `checkout.session.completed`. No Stripe Customer Portal needed — there is no subscription to manage.

Alternatives: Per-report billing (complex: requires Stripe PaymentIntent per analysis, idempotency handling); monthly subscription (requires Customer Portal, churn management — save for v2 once product is validated).

### 8. `optimizedBullets` as Lifetime-only feature

The partial-reveal paywall on `/results`: free users see all fields except `optimizedBullets` (blurred, with an upgrade CTA). This is the key conversion mechanic — the user has already received value from the free analysis before hitting the upgrade prompt.

### 9. `@vercel/og` for shareable result cards

Edge image generation at `/api/og` builds a branded PNG from query params (`score`, `fit`, `role`). The image is generated on demand with no storage. This is the primary viral loop for TikTok/Instagram/LinkedIn organic growth.

### 10. MDX files in-repo for blog

Blog posts as `.mdx` files under `/content/blog/`. `next-mdx-remote` renders them at `/blog/[slug]`. Simple, zero CMS dependency for MVP. Sufficient for the initial batch of long-tail SEO posts. Migrate to Sanity in v2 if content volume requires it.

## Risks / Trade-offs

- **"Interview probability" misinterpretation** → Mitigated: field renamed `recruiterFit` with qualitative values ("Likely to shortlist", "Competitive", "Borderline", "Unlikely"); numeric value is `atsScore` only (keyword/format matching)
- **Claude JSON output reliability** → Mitigated: Vercel AI SDK tool-use with Zod schema forces valid structured output; retry once on validation failure with a reduced prompt
- **Free report "lost on tab close"** → Mitigated: warning modal with explicit copy before first submission; `freeReportUsed` only set after successful stream completion
- **UK VAT / AU GST / US sales tax compliance** → Mitigated: enable Stripe Tax from day one; Stripe handles calculation and remittance
- **mammoth client-side bundle size** → mammoth browser build is ~200KB gzipped; loaded only on `/analyze` route via dynamic import
- **unpdf cold start latency** → unpdf runs in Node.js serverless (not edge); acceptable latency for PDF parsing (<500ms); not on the critical rendering path
- **better-auth modal sign-in form state** → form state held in React memory (not URL, not sessionStorage); File objects survive modal sign-in because no page navigation occurs

## Migration Plan

Greenfield — no migration needed. Deployment sequence:

1. Provision Neon Postgres database
2. Run `drizzle-kit push` to create schema (better-auth tables + custom columns)
3. Configure Stripe product + webhook endpoint
4. Set all environment variables in Vercel
5. Deploy to Vercel

Rollback: feature flags not needed; rollback via Vercel instant rollback on deployment failure.

## Open Questions

- Should Google OAuth be the only social provider for MVP, or also GitHub? (GitHub is relevant for SWEs but adds config surface; Google covers all target personas)
- PDF upload size limit: 5MB cap is reasonable for resumes; enforce at the `/api/parse-pdf` route
- Should the shareable OG card include the job title/company? Requires user to input that field separately — consider adding an optional "Role you're applying for" field to the `/analyze` form
