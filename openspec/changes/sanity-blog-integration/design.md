## Context

Blog posts currently live as `.mdx` files in `content/blog/`. The `src/lib/mdx.ts` module reads them from disk using Node's `fs` module and `gray-matter` for frontmatter parsing. `next-mdx-remote` renders the MDX body. This works fine for developers but forces every content change through a Git commit + Vercel deploy cycle — no CMS dashboard, no draft preview, no non-developer publishing.

## Goals / Non-Goals

**Goals:**
- Replace filesystem-based blog with Sanity as the content source
- Preserve existing URL structure (`/blog`, `/blog/[slug]`) and SEO metadata
- Enable ISR so published post changes appear without a full redeploy
- Keep the embedded CTA and JSON-LD structured data on post pages

**Non-Goals:**
- Embedded Sanity Studio inside the Next.js app (use sanity.io hosted Studio)
- Preview mode / draft previews (post-MVP)
- Migrating historical MDX posts automatically (manual re-entry into Sanity is acceptable given 3 posts)
- Rich media uploads beyond the post body (images in Portable Text are acceptable, dedicated asset CDN is not in scope)

## Decisions

### 1. Data fetching: `next-sanity` with GROQ over REST API

Use the `next-sanity` package which wraps `@sanity/client` and exposes a `createClient` function compatible with Next.js's `fetch` caching semantics. GROQ queries are issued server-side inside Server Components — no API route needed.

**Why not REST API directly?** GROQ is expressive enough to project only the fields we need in one round-trip. The REST API requires separate requests or CDN URL construction.

**Why not `@sanity/client` directly?** `next-sanity` adds `revalidate` tag support out of the box, which we need for ISR.

### 2. Revalidation: ISR with `revalidate = 3600`

Both `/blog` and `/blog/[slug]` pages set `export const revalidate = 3600` (1 hour). This means Vercel serves the cached page and regenerates in the background after an hour. Draft publishing in Sanity becomes live within 1 hour without a deploy.

**Why not on-demand revalidation webhook?** Adds Sanity webhook configuration + a `/api/revalidate` endpoint. Not worth the complexity for a low-traffic blog with no SLA on instant publish.

### 3. Content rendering: `@portabletext/react` replacing `next-mdx-remote`

Sanity stores body content as Portable Text (structured JSON). `@portabletext/react` renders it to HTML. We provide a minimal `components` map that maps block types to Tailwind-styled elements matching the current `prose prose-slate` appearance.

**Why not keep MDX?** Sanity's native editor produces Portable Text. Storing raw MDX in Sanity as a string and running `next-mdx-remote` on it loses all the structured editing benefits and makes the Sanity editor unusable.

### 4. Schema: single `post` document type

```
post {
  _id, _type: "post"
  title: string
  slug: { current: string }
  description: string
  date: datetime
  keywords: array<string>
  body: array<block>   // Portable Text
}
```

No author, category, or tags — matches the existing frontmatter surface exactly.

### 5. Sanity project: Free tier, `production` dataset

One project, one dataset. No separate staging dataset for MVP.

## Risks / Trade-offs

- **External dependency at build time** — `generateStaticParams` now queries Sanity. If the Sanity API is down during a Vercel build, the build fails. Mitigation: Sanity's hosted API has a strong SLA; acceptable risk at this scale.
- **ISR cache lag** — Post updates take up to 1 hour to surface. Mitigation: documented in the CMS workflow; editors can trigger a manual Vercel redeploy for urgent corrections.
- **Portable Text parity** — The existing MDX posts may use custom JSX components that have no Portable Text equivalent. Mitigation: the 3 existing posts use only standard markdown (headings, paragraphs, lists, bold/italic, links) — all are standard Portable Text block types.
- **Cold-start query** — First request after cache expiry fetches from Sanity. With ISR this happens in the background so users see no latency. Mitigation: none needed.
- **Removing `gray-matter` + `next-mdx-remote`** — Breaks any future attempt to re-add local MDX files. Mitigation: acceptable trade-off; if needed they can be re-added.

## Migration Plan

1. Create Sanity project (free tier) + `production` dataset via sanity.io dashboard
2. Define and deploy the `post` schema via Sanity CLI (`sanity deploy`)
3. Re-enter the 3 existing blog posts in Sanity Studio
4. Add env vars to `.env.local` and Vercel project settings
5. Implement code changes (new `src/lib/sanity.ts`, update blog pages)
6. Test locally: `npm run dev` → verify list and slug pages render
7. Remove `content/blog/` directory and `src/lib/mdx.ts`
8. Remove `gray-matter` and `next-mdx-remote` from `package.json`
9. Deploy to Vercel preview → verify ISR and metadata
10. Merge to main

**Rollback**: if Sanity queries fail post-deploy, revert the merge — the old filesystem approach is fully preserved in git history. MDX files are not deleted until the deploy is verified.
