## 1. Sanity Project Setup (manual — do before coding)

- [ ] 1.1 Create a Sanity project at sanity.io — note the Project ID
- [ ] 1.2 Create a dataset named `production`
- [ ] 1.3 Add `SANITY_PROJECT_ID` and `SANITY_DATASET` to `src/env.ts` Zod schema (server + public)
- [ ] 1.4 Add `SANITY_PROJECT_ID=...` and `SANITY_DATASET=production` to `.env.local` and Vercel env vars

## 2. Sanity Schema

- [ ] 2.1 Create `sanity/schemas/post.ts` — document type with fields: `title`, `slug`, `description`, `publishedAt`, `keywords`, `body` (blockContent)
- [ ] 2.2 Create `sanity/schemas/blockContent.ts` — standard block content type
- [ ] 2.3 Create `sanity/schemas/index.ts` — export schema types array
- [ ] 2.4 Create `sanity.config.ts` at project root — configure Sanity Studio (for local use / deploying to sanity.io)
- [ ] 2.5 Deploy schema to sanity.io (`npx sanity deploy` or via sanity.io dashboard)

## 3. Install Dependencies

- [ ] 3.1 Install `@sanity/client` and `@portabletext/react`
- [ ] 3.2 Remove `gray-matter` and `next-mdx-remote` from `package.json` (`npm uninstall gray-matter next-mdx-remote`)

## 4. Sanity Data Layer

- [ ] 4.1 Create `src/lib/sanity.ts` — Sanity client configured with `env.SANITY_PROJECT_ID` and `env.SANITY_DATASET`, `useCdn: true`
- [ ] 4.2 Implement `getAllPosts(): Promise<PostMeta[]>` — GROQ query returning all published posts sorted by `publishedAt` desc
- [ ] 4.3 Implement `getPost(slug: string): Promise<Post | null>` — GROQ query fetching single post by slug, including `body` Portable Text

## 5. Update Blog Pages

- [ ] 5.1 Update `src/app/blog/page.tsx` — import from `@/lib/sanity` instead of `@/lib/mdx`, add `export const revalidate = 3600`
- [ ] 5.2 Update `src/app/blog/[slug]/page.tsx` — import from `@/lib/sanity`, replace `MDXRemote` with `PortableText` from `@portabletext/react`, add `export const revalidate = 3600`
- [ ] 5.3 Wrap `PortableText` output in `<div className="prose prose-slate max-w-none">` to preserve styling

## 6. Content Migration

- [ ] 6.1 Enter all 3 existing posts into Sanity Studio manually (title, slug, description, publishedAt, keywords, body)
- [ ] 6.2 Verify each post renders correctly at `/blog/[slug]` in dev

## 7. Cutover & Cleanup

- [ ] 7.1 Delete `content/blog/` directory
- [ ] 7.2 Delete `src/lib/mdx.ts`
- [ ] 7.3 Run `npm run build` — confirm no import errors
- [ ] 7.4 Deploy to production and verify `/blog` and all 3 post slugs render correctly
