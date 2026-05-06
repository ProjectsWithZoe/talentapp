## Why

Blog content currently lives as MDX files in `content/blog/` — editing requires a code change and a deployment. Moving to Sanity gives a browser-based editor so posts can be written, edited, and published without touching the repo or triggering a redeploy.

## What Changes

- Replace file-system MDX data layer (`src/lib/mdx.ts`, `gray-matter`) with Sanity GROQ queries (`src/lib/sanity.ts`, `@sanity/client`)
- Replace `MDXRemote` rendering with `@portabletext/react` for Sanity's Portable Text format
- Add ISR revalidation (`revalidate: 3600`) to `/blog` and `/blog/[slug]` pages
- Delete `content/blog/*.mdx`, `src/lib/mdx.ts`, and remove `gray-matter` + `next-mdx-remote` dependencies once Sanity is live
- Sanity Studio hosted separately on sanity.io (not embedded in the app)

## Capabilities

### New Capabilities

- `sanity-blog`: Fetch and render blog posts from Sanity CMS using GROQ, with ISR revalidation — replaces the MDX file-system approach entirely

### Modified Capabilities

_(none — no existing spec files to delta)_

## Impact

- `src/lib/sanity.ts`: new file — Sanity client + `getAllPosts()` / `getPost()` matching current interface
- `src/app/blog/page.tsx`: switch import from `mdx` to `sanity`, add `revalidate`
- `src/app/blog/[slug]/page.tsx`: switch import, replace `MDXRemote` with `@portabletext/react`, add `revalidate`
- `package.json`: add `@sanity/client`, `@portabletext/react`; remove `gray-matter`, `next-mdx-remote`
- New env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`
- Deleted: `content/blog/`, `src/lib/mdx.ts`
- No DB schema changes, no auth changes, no API routes added
