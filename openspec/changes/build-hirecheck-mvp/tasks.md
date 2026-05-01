## 1. Project Scaffold

- [x] 1.1 Initialise Next.js App Router project with TypeScript and Tailwind CSS (`npx create-next-app@latest`)
- [x] 1.2 Install core dependencies: `better-auth`, `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `ai`, `@anthropic-ai/sdk`, `zod`, `stripe`, `@vercel/og`, `next-mdx-remote`, `mammoth`, `unpdf`, `shadcn-ui`
- [x] 1.3 Initialise shadcn/ui (`npx shadcn@latest init`) and add components: Button, Dialog, Badge, Card, Input, Textarea, Progress, Skeleton
- [x] 1.4 Set up environment variable schema (`src/env.ts` with zod) for `ANTHROPIC_API_KEY`, `BETTER_AUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_LIFETIME_PRICE_ID`, `NEXT_PUBLIC_APP_URL`
- [x] 1.5 Configure `openspec/config.yaml` with the full project tech stack, domain context, and conventions

## 2. Database and Auth

- [ ] 2.1 Provision Neon Postgres database and save `DATABASE_URL` to `.env.local` ⚠️ MANUAL STEP
- [x] 2.2 Configure better-auth at `src/lib/auth.ts` with Drizzle adapter, Google OAuth provider, and email/password provider
- [x] 2.3 Create Drizzle schema at `src/db/schema.ts`: better-auth tables (`users`, `sessions`, `accounts`) plus `tier` (enum: `'free'|'lifetime'`, default `'free'`) and `freeReportUsed` (boolean, default `false`) columns on `users`
- [ ] 2.4 Run `drizzle-kit push` to apply schema to Neon ⚠️ MANUAL STEP (needs DATABASE_URL)
- [x] 2.5 Create better-auth API route at `src/app/api/auth/[...all]/route.ts`
- [x] 2.6 Create `src/lib/auth-client.ts` with better-auth React client (`createAuthClient`)
- [x] 2.7 Create `src/lib/db.ts` Drizzle client using `@neondatabase/serverless`

## 3. Authentication UI

- [x] 3.1 Create `<AuthModal>` component (`src/components/auth/auth-modal.tsx`) using shadcn Dialog with Google OAuth button and email/password form; calls better-auth `signIn()` methods without page navigation
- [x] 3.2 Create `<UserMenu>` component showing sign-in button (unauthenticated) or avatar/sign-out (authenticated) using `useSession()` from better-auth React client
- [x] 3.3 Add `<UserMenu>` to the site-wide `<Header>` component

## 4. Landing Page

- [x] 4.1 Create `src/app/page.tsx` landing page with hero section (headline, sub-headline, primary CTA to `/analyze`)
- [x] 4.2 Add features section explaining each analysis output (ATS score, recruiter fit, missing skills, rejection risks, recruiter perception, fixes, optimized bullets)
- [x] 4.3 Add pricing section with Free tier (1 analysis) and Lifetime tier (£99) cards and CTAs
- [x] 4.4 Add at least one social proof element (example result card or testimonial placeholder)
- [x] 4.5 Add SEO metadata to `src/app/layout.tsx`: `<title>`, `<meta name="description">`, Open Graph tags with long-tail tech job seeker keywords
- [x] 4.6 Create `<Header>` and `<Footer>` layout components with hirecheck.io branding and navigation

## 5. File Upload and Parsing

- [x] 5.1 Create `/api/parse-pdf` route (`src/app/api/parse-pdf/route.ts`) that accepts a multipart form upload, extracts text using `unpdf`, enforces 5MB size limit, and returns `{ text: string }`
- [x] 5.2 Create `src/lib/parse-docx.ts` browser-side mammoth wrapper that accepts a `File` object and returns plain text (dynamic import to avoid SSR)
- [x] 5.3 Create `<ResumeUpload>` component supporting drag-and-drop or click-to-select for `.docx` and `.pdf`; shows filename and extracted text preview on success; shows inline error for unsupported format or oversized file

## 6. Analyze Page

- [x] 6.1 Create `src/app/analyze/page.tsx` with `<ResumeUpload>` component, job description textarea, and "Analyze" submit button
- [x] 6.2 Implement pre-submission logic: check auth state → if unauthenticated, open `<AuthModal>`; check `freeReportUsed` → if free user's first report, open `<FreeWarningModal>`
- [x] 6.3 Create `<FreeWarningModal>` component with copy explaining: one free report, cannot retrieve if tab closes, download PDF before leaving; Confirm and Cancel buttons
- [x] 6.4 On form submit (auth confirmed, warning dismissed), POST resume text and job description to `/api/analyze` and navigate to `/results` passing a session/stream reference

## 7. Analysis API

- [x] 7.1 Create Zod schema for analysis output (`src/lib/analysis-schema.ts`): `atsScore`, `recruiterFit` (enum), `strongMatches`, `missingSkills`, `rejectionRisks`, `recruiterPerception`, `fixes`, `optimizedBullets`
- [x] 7.2 Create Claude system prompt (`src/lib/prompts.ts`) framing Claude as senior recruiter + simulated ATS + hiring manager; include explicit note that `atsScore` is keyword/format alignment only; conditionally include `optimizedBullets` instruction for lifetime users
- [x] 7.3 Create `/api/analyze` route (`src/app/api/analyze/route.ts`): authenticate request, check entitlement, call `generateObject` with Zod schema, handle validation failure with one retry, set `freeReportUsed = true` on completion
- [x] 7.4 Add Zod validation failure retry logic: on first failure, retry with a simplified prompt stripping `optimizedBullets`; on second failure return HTTP 500

## 8. Results Page

- [x] 8.1 Create `src/app/results/page.tsx` that reads analysis data from Zustand store and renders each section with staggered animations
- [x] 8.2 Implement ATS score section with progress bar showing `atsScore` out of 100
- [x] 8.3 Implement `recruiterFit` badge with colour coding: green (Likely to shortlist), yellow (Competitive), orange (Borderline), red (Unlikely)
- [x] 8.4 Implement chip list sections for `strongMatches` and `missingSkills`
- [x] 8.5 Implement warning list for `rejectionRisks` and prose block for `recruiterPerception`
- [x] 8.6 Implement numbered fixes list for `fixes` (3–5 items)
- [x] 8.7 Implement `optimizedBullets` section: full display for lifetime users; blurred overlay with "Unlock Lifetime — £99" CTA for free users
- [x] 8.8 Handle error/empty state: redirect to `/analyze` if no result in store

## 9. PDF Download and Sharing

- [x] 9.1 Add client-side PDF generation (`src/lib/generate-pdf.ts` with jspdf); "Download Report" button triggers download as `hirecheck-report.pdf`
- [x] 9.2 Create `/api/og` route (`src/app/api/og/route.tsx`) using `next/og` to generate a 1200×630 PNG with hirecheck.io branding, `score`, `fit`, and `role` query params
- [x] 9.3 OG meta tags handled by results page dynamic metadata
- [x] 9.4 Add "Share Results" button: copies URL to clipboard on desktop; triggers Web Share API on mobile

## 10. Payments

- [ ] 10.1 Create Stripe product and one-time price (£99 GBP) in Stripe Dashboard; save `STRIPE_LIFETIME_PRICE_ID` to env ⚠️ MANUAL STEP
- [ ] 10.2 Enable Stripe Tax on the account and configure for GB, AU, CA, US ⚠️ MANUAL STEP
- [x] 10.3 Create `/api/checkout` route (`src/app/api/checkout/route.ts`): authenticate user, create Stripe Checkout Session with `mode: 'payment'`, Lifetime price, customer email pre-filled, `success_url: /success`, `cancel_url: /analyze`
- [x] 10.4 Create `/api/webhooks/stripe` route: verify Stripe signature, handle `checkout.session.completed`, update `users.tier = 'lifetime'` by matching `customer_email`
- [x] 10.5 Create `src/app/success/page.tsx` with upgrade confirmation, "Start Analyzing" CTA to `/analyze`, and a share-the-tool prompt

## 11. Blog

- [x] 11.1 Set up MDX rendering: configure `next-mdx-remote` in Next.js App Router, create `src/lib/mdx.ts` to read and parse `.mdx` files from `/content/blog/`
- [x] 11.2 Create `src/app/blog/page.tsx` blog index listing all posts sorted by date descending
- [x] 11.3 Create `src/app/blog/[slug]/page.tsx` individual post renderer with JSON-LD Article structured data
- [x] 11.4 Write initial blog post 1: "Why Your Tech Resume Gets Rejected Before a Human Reads It"
- [x] 11.5 Write initial blog post 2: "UK Tech CV vs US Resume: What Hiring Managers Actually Want in 2025"
- [x] 11.6 Write initial blog post 3: "ATS Keywords for Software Engineers: The Complete 2025 Guide"

## 12. Polish and Pre-launch

- [x] 12.1 Add `robots.txt` and `sitemap.xml` (include blog posts and main pages)
- [x] 12.2 Add `<link rel="canonical">` to all pages (via `metadataBase` in layout.tsx)
- [ ] 12.3 Audit all pages for mobile responsiveness (results page, analyze form, landing page) ⚠️ MANUAL STEP
- [x] 12.4 Add rate limiting to `/api/analyze` (5 requests/min per IP via middleware)
- [ ] 12.5 Configure Vercel project, link to hirecheck.io domain, and set all production environment variables ⚠️ MANUAL STEP
- [ ] 12.6 Run end-to-end test of full flow: sign up → free analysis → upgrade → lifetime analysis with optimizedBullets → PDF download → share card ⚠️ MANUAL STEP
