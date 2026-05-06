## ADDED Requirements

### Requirement: Blog posts are fetched from Sanity via GROQ
The system SHALL fetch all blog post data from a Sanity project using `@sanity/client`. The client SHALL be configured with `SANITY_PROJECT_ID` and `SANITY_DATASET` environment variables. The dataset SHALL default to `"production"`. All queries SHALL use the Sanity CDN (`useCdn: true`) for published content — no token required.

#### Scenario: Posts are listed on /blog
- **WHEN** a request is made to `/blog`
- **THEN** the system fetches all published posts from Sanity, sorted by `publishedAt` descending, and renders them as a list

#### Scenario: A single post is rendered on /blog/[slug]
- **WHEN** a request is made to `/blog/[slug]` with a valid slug
- **THEN** the system fetches the post matching that slug from Sanity and renders its Portable Text body

#### Scenario: A slug that does not exist in Sanity
- **WHEN** a request is made to `/blog/[slug]` with a slug that has no matching Sanity document
- **THEN** the system calls `notFound()` and renders the 404 page

#### Scenario: SANITY_PROJECT_ID is missing at startup
- **WHEN** the application starts without `SANITY_PROJECT_ID` set
- **THEN** the server throws an error and refuses to start (via `src/env.ts` Zod validation)

### Requirement: Blog pages use ISR with a 1-hour revalidation window
Both `/blog` and `/blog/[slug]` SHALL export `export const revalidate = 3600`. Pages SHALL be statically generated at build time and refreshed at most once per hour in the background.

#### Scenario: A post is published in Sanity after the last build
- **WHEN** a new post is published in Sanity Studio and up to 1 hour passes
- **THEN** the post appears on `/blog` without a manual redeploy

#### Scenario: Build-time static generation
- **WHEN** the app is built
- **THEN** `generateStaticParams` fetches all post slugs from Sanity and pre-renders each `/blog/[slug]` page

### Requirement: Blog post body is rendered as Portable Text
The system SHALL render post body content using `@portabletext/react`. The rendered output SHALL be wrapped in `<div className="prose prose-slate max-w-none">` to apply Tailwind Typography styling consistent with the previous MDX rendering.

#### Scenario: Post with standard content blocks
- **WHEN** a post contains headings, paragraphs, lists, and inline code in Portable Text format
- **THEN** the system renders them as correctly structured HTML with prose styling applied

### Requirement: Sanity post schema includes all fields from the current MDX frontmatter
The Sanity `post` document type SHALL include: `title` (string, required), `slug` (slug, required, source: title), `description` (text, required), `publishedAt` (datetime, required), `keywords` (array of strings, optional), `body` (blockContent / Portable Text, required).

#### Scenario: Post data is mapped to PostMeta interface
- **WHEN** `getAllPosts()` fetches posts from Sanity
- **THEN** each result maps to `{ title, description, date, slug, keywords? }` matching the existing `PostMeta` TypeScript interface

### Requirement: MDX infrastructure is removed after Sanity cutover
After Sanity is live and posts are migrated, the system SHALL NOT retain any MDX file-reading code. The following SHALL be deleted: `content/blog/` directory, `src/lib/mdx.ts`, `gray-matter` package, `next-mdx-remote` package.

#### Scenario: No MDX files remain post-cutover
- **WHEN** the cutover is complete
- **THEN** `content/blog/` does not exist and `src/lib/mdx.ts` is not importable
