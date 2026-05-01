## Why

Tech job seekers in the US, UK, Canada, and Australia routinely apply to roles without knowing whether their resume will survive ATS screening or resonate with a recruiter — resulting in application black holes. hirecheck.io solves this by using Claude as a simulated senior recruiter and ATS system to give instant, actionable analysis before candidates invest time applying.

## What Changes

This is a greenfield build — no existing application code. All capabilities below are new.

- **Landing page** (`/`): Conversion-focused page explaining the product, targeting tech job seekers (SWEs, DevOps, Data Analysts, Product Engineers) across US/UK/CA/AU with long-tail SEO keywords
- **Analysis flow** (`/analyze`): Accepts resume via `.docx` upload (mammoth, browser-side) or `.pdf` upload (unpdf, server-side), plus a pasted job description; triggers Claude analysis with streaming
- **Results view** (`/results`): Streams and displays structured analysis — ATS score (numeric), recruiter fit (qualitative), strong matches, missing skills, rejection risks, recruiter perception, and 3–5 fixes; `optimizedBullets` blurred for free users
- **Authentication** (better-auth): Google OAuth + email/password; required to view results (modal sign-in, not page redirect, to preserve form state); sessions backed by Neon Postgres
- **Entitlement system**: Free tier (1 report lifetime, no `optimizedBullets`); Lifetime tier (£99 one-time, unlimited reports + `optimizedBullets`); free-use warning modal before first submission
- **Payments** (Stripe): Single one-time product for Lifetime tier; webhook updates `users.tier` in DB
- **Shareable result card** (`/api/og`): `@vercel/og` generates a branded PNG from result metadata for social sharing (TikTok, LinkedIn, Instagram)
- **Blog** (`/blog`): MDX-based blog for long-tail SEO content (UK/AU/CA/US tech resume guides, ATS-specific posts)
- **PDF download**: Client-side generation of full report as a downloadable PDF

## Capabilities

### New Capabilities

- `resume-analysis`: Core Claude-powered analysis pipeline — file parsing, prompt construction, streaming JSON response, structured output validation
- `auth`: User authentication and session management via better-auth (Google OAuth + email/password) with Neon Postgres backing
- `entitlement`: Tier management — free (1 report, no optimizedBullets) vs lifetime (£99, unlimited + optimizedBullets); free-use warning modal; `freeReportUsed` tracking
- `payments`: Stripe one-time checkout for Lifetime tier; webhook handler to update user tier
- `results-display`: Streaming results page with partial-reveal paywall for `optimizedBullets`; shareable OG image generation; PDF download
- `landing-page`: SEO-optimised landing page with conversion copy targeting tech job seekers
- `blog`: MDX blog at `/blog` for long-tail SEO content

### Modified Capabilities

## Impact

- **New dependencies**: `better-auth`, `drizzle-orm`, `@neondatabase/serverless`, `ai` (Vercel AI SDK), `@anthropic-ai/sdk`, `mammoth`, `unpdf`, `stripe`, `@vercel/og`, `next-mdx-remote`, `zod`
- **Infrastructure**: Neon Postgres (auth + entitlement), Vercel (hosting + edge OG images), Stripe (payments), Anthropic API (Claude)
- **Environment variables**: `ANTHROPIC_API_KEY`, `BETTER_AUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_LIFETIME_PRICE_ID`, `NEXT_PUBLIC_APP_URL`
- **No breaking changes** — greenfield
