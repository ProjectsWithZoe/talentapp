## Why

The blog currently requires developer intervention to publish posts — content lives as `.mdx` files in `content/blog/` that must be committed and deployed. Replacing this with Sanity.io gives non-technical editors a live CMS dashboard to create, update, and publish posts without touching the codebase, and enables preview drafts before going live.

## What Changes

- Remove `content/blog/*.mdx` static files and `src/lib/mdx.ts` filesystem reader
- Remove `gray-matter` and `next-mdx-remote` dependencies (replaced by Sanity client + Portable Text)
- Add Sanity project, dataset, and schema for blog posts (`title`, `slug`, `description`, `date`, `keywords`, `body` as Portable Text)
- Add `@sanity/client` and `@portabletext/react` packages
- Replace `src/lib/mdx.ts` with `src/lib/sanity.ts` (GROQ queries via Sanity client)
- Update `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` to fetch from Sanity
- Update `generateStaticParams` to pull slugs from Sanity at build time (ISR-compatible)
- Add Sanity environment variables to `.env.local` and Vercel project settings

## Capabilities

### New Capabilities

- `sanity-blog`: Sanity-backed blog — schema definition, GROQ queries, Portable Text rendering, ISR revalidation, and Sanity Studio access

### Modified Capabilities

<!-- No existing specs are changing requirements -->

## Impact

- **Removed files**: `content/blog/*.mdx`, `src/lib/mdx.ts`
- **New files**: `src/lib/sanity.ts`, Sanity schema files (managed outside repo or via embedded Studio)
- **Dependencies**: remove `gray-matter`, `next-mdx-remote`; add `@sanity/client`, `next-sanity`, `@portabletext/react`
- **Environment variables**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` (read token for server-side queries)
- **Build**: `generateStaticParams` switches from filesystem read to GROQ query — requires Sanity project to exist before first build
- **No impact** on auth, analysis, payments, or any API routes
