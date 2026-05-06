## 1. Sanity Project Setup (manual — do before coding)

- [x] 1.1 Create a new Sanity project at sanity.io (free tier), name it `talentapp-blog`, dataset `production`
- [x] 1.2 Note the project ID from the Sanity dashboard
- [x] 1.3 Generate a read-only API token in Sanity → API → Tokens

## 2. Dependencies

- [x] 2.1 Install packages: `npm install next-sanity @portabletext/react`
- [x] 2.2 Remove packages: `npm uninstall gray-matter next-mdx-remote`

## 3. Environment Variables

- [x] 3.1 Add `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, and `SANITY_API_TOKEN` to `.env.local`
- [ ] 3.2 Add all three vars to Vercel project settings (Production + Preview + Development environments)
- [x] 3.3 Add the three Sanity vars to `src/env.ts` validation schema

## 4. Sanity Schema

- [x] 4.1 Create `sanity/schemaTypes/post.ts` defining the `post` document type with fields: `title`, `slug`, `description`, `date`, `keywords`, `body` (Portable Text)
- [x] 4.2 Create `sanity/schemaTypes/index.ts` exporting the schema types array
- [x] 4.3 Create `sanity.config.ts` at the project root with the Sanity Studio config (project ID, dataset, schema)
- [ ] 4.4 Deploy the schema: `npx sanity@latest deploy` (or via Sanity CLI)

## 5. Sanity Client

- [x] 5.1 Create `src/lib/sanity.ts` with a `createClient` call using env vars (`projectId`, `dataset`, `apiVersion: "2024-01-01"`, `cdn: true`, `token: SANITY_API_TOKEN`)
- [x] 5.2 Export typed GROQ query helpers: `getAllPosts()` returning `PostMeta[]` and `getPost(slug)` returning `Post | null`
- [x] 5.3 Define the `PostMeta` and `Post` TypeScript interfaces matching the Sanity schema fields

## 6. Blog Pages

- [x] 6.1 Update `src/app/blog/page.tsx`: add `export const revalidate = 3600`, replace `getAllPosts()` import with the new Sanity version, remove any `fs`/mdx imports
- [x] 6.2 Update `src/app/blog/[slug]/page.tsx`: add `export const revalidate = 3600`, replace `getAllPosts` and `getPost` with Sanity versions, replace `<MDXRemote>` with `<PortableText>` from `@portabletext/react`
- [x] 6.3 Add a `components` prop to `<PortableText>` mapping block types (`h2`, `h3`, `normal`, `ul`, `ol`, `link`) to Tailwind-styled elements matching the `prose prose-slate` appearance
- [x] 6.4 Verify `generateStaticParams` in the slug page queries Sanity for slugs (using `getAllPosts`)
- [x] 6.5 Verify `generateMetadata` in the slug page maps Sanity fields to `title`, `description`, `keywords`, and `openGraph.publishedTime`

## 7. Content Migration

- [ ] 7.1 Re-enter the 3 existing blog posts in Sanity Studio (`ats-keywords-software-engineers-2025`, `why-your-tech-resume-gets-rejected`, `uk-cv-vs-us-resume`)
- [ ] 7.2 Publish all 3 posts in Sanity Studio

## 8. Cleanup

- [x] 8.1 Delete `src/lib/mdx.ts`
- [x] 8.2 Delete `content/blog/` directory and all `.mdx` files
- [x] 8.3 Verify no remaining imports of `gray-matter`, `next-mdx-remote`, or `@/lib/mdx` exist

## 9. Verification

- [ ] 9.1 Run `npm run dev` and confirm `/blog` renders all 3 posts from Sanity
- [ ] 9.2 Confirm `/blog/[slug]` renders post body, metadata, and the CTA card at the bottom
- [ ] 9.3 Confirm a non-existent slug returns 404
- [ ] 9.4 Run `npm run build` and confirm build succeeds with static params from Sanity
- [ ] 9.5 Run `npm run lint` and confirm no lint errors
