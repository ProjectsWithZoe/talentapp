## Context

The blog currently reads MDX files from `content/blog/` at build time via `src/lib/mdx.ts`. Three posts exist. The goal is to replace this with a Sanity-backed data layer that fetches posts via GROQ, keeping the page components largely unchanged. Sanity Studio is hosted on sanity.io — not embedded in the Next.js app.

## Goals / Non-Goals

**Goals:**
- Drop-in replacement of the data layer: same `getAllPosts()` / `getPost()` interface, same field names
- ISR with `revalidate: 3600` on both blog pages (posts go live within 1 hour of publishing)
- Portable Text rendering replacing MDXRemote, with Tailwind Typography prose styling preserved
- Complete removal of MDX infrastructure once Sanity is live

**Non-Goals:**
- Draft preview / preview mode
- Sanity webhook for on-demand revalidation
- Embedded Studio at `/studio`
- Image handling beyond what Sanity's CDN provides automatically
- Author profiles, tags, or categories (not in current schema)

## Decisions

**1. Mirror the current `PostMeta` / `Post` interface in `src/lib/sanity.ts`**
`getAllPosts()` returns `PostMeta[]` and `getPost(slug)` returns `Post | null` — identical signatures to the current `mdx.ts`. This means `blog/page.tsx` and `blog/[slug]/page.tsx` need minimal edits (just swap the import and add `revalidate`).

**2. Unauthenticated CDN client — no `SANITY_TOKEN`**
Published content is served from Sanity's public CDN. No token needed for reads. If draft preview is added later, a token would be required then.

**3. `@portabletext/react` with a minimal custom components map**
Prose styling is handled by Tailwind Typography (`prose prose-slate`). The Portable Text renderer wraps content in the same `<div className="prose prose-slate max-w-none">` that currently wraps `MDXRemote`. Custom components only needed for anything the default renderer doesn't handle (e.g. images with `next/image` — defer unless needed).

**4. ISR `revalidate: 3600` — not on-demand**
A 1-hour cache window is acceptable for a blog. Webhook-based on-demand revalidation adds an API endpoint and Sanity webhook config — not worth it for the current publishing cadence.

**5. `generateStaticParams` stays, backed by Sanity**
The slug list for static generation comes from `getAllPosts()` — same call, now hitting Sanity. This pre-renders all posts at build time; ISR handles updates after.

## Risks / Trade-offs

- **Sanity project must exist before implementation** → Create the project and schema first; get `SANITY_PROJECT_ID` before writing `src/lib/sanity.ts`.
- **Existing posts need manual migration** → 3 MDX posts must be entered into Sanity Studio before the code cutover; otherwise `/blog` shows empty.
- **`next-mdx-remote` removal breaks MDX rendering permanently** → Once deleted, there's no fallback. Migration should be verified in staging before production cutover.
- **Portable Text ≠ MDX** → MDX custom components (JSX in markdown) are gone. The existing posts are plain prose so this is fine, but future posts are limited to Portable Text's capabilities (still rich: headings, lists, code, images, links).
