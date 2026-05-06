## ADDED Requirements

### Requirement: Blog post list fetched from Sanity
The system SHALL fetch all published blog posts from Sanity using a GROQ query and render them on `/blog`, ordered by date descending. The query SHALL project only `title`, `slug.current`, `description`, and `date` fields.

#### Scenario: Posts exist in Sanity
- **WHEN** one or more `post` documents are published in Sanity
- **THEN** `/blog` renders a card for each post with title, date, and description

#### Scenario: No posts in Sanity
- **WHEN** no `post` documents are published in Sanity
- **THEN** `/blog` renders the "No posts yet — check back soon." fallback message

### Requirement: Blog post page fetched from Sanity
The system SHALL fetch a single post by slug from Sanity and render it at `/blog/[slug]`. The body SHALL be rendered as Portable Text using `@portabletext/react`.

#### Scenario: Valid slug
- **WHEN** a user navigates to `/blog/[slug]` for an existing published post
- **THEN** the page renders the post title, date, description, and body content

#### Scenario: Invalid or unpublished slug
- **WHEN** a user navigates to `/blog/[slug]` for a slug with no matching published post
- **THEN** the page calls `notFound()` and returns a 404

### Requirement: Static params generated from Sanity
The system SHALL implement `generateStaticParams` by querying all published post slugs from Sanity at build time, so that all post pages are statically generated.

#### Scenario: Build-time slug generation
- **WHEN** Next.js builds the app
- **THEN** `generateStaticParams` returns an array of `{ slug: string }` objects from Sanity

### Requirement: SEO metadata sourced from Sanity fields
The system SHALL generate `<title>`, `<meta description>`, `keywords`, and Open Graph tags from the Sanity post's `title`, `description`, `keywords`, and `date` fields — matching the existing metadata behavior.

#### Scenario: Post metadata generation
- **WHEN** Next.js generates metadata for `/blog/[slug]`
- **THEN** `generateMetadata` returns title, description, keywords, and openGraph.publishedTime from the Sanity document

### Requirement: ISR revalidation on blog pages
Both `/blog` and `/blog/[slug]` pages SHALL export `revalidate = 3600` so that cached pages are regenerated in the background at most every 1 hour.

#### Scenario: Cache revalidation
- **WHEN** a blog page's cache TTL has expired and a new request arrives
- **THEN** Vercel serves the stale page immediately and regenerates the new page in the background

### Requirement: Sanity post schema
The Sanity project SHALL define a `post` document type with the following fields:
- `title` (string, required)
- `slug` (slug, source: `title`, required)
- `description` (string, required)
- `date` (datetime, required)
- `keywords` (array of strings, optional)
- `body` (array of blocks — Portable Text, required)

#### Scenario: Schema validation in Studio
- **WHEN** an editor creates a new post in Sanity Studio
- **THEN** the Studio enforces required fields (title, slug, description, date, body) before allowing publish

### Requirement: Sanity client configuration
The system SHALL configure the Sanity client in `src/lib/sanity.ts` using `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_TOKEN` environment variables. The client SHALL use API version `2024-01-01` and `cdn: true` for production reads.

#### Scenario: Missing environment variables
- **WHEN** any required Sanity env var is absent at startup
- **THEN** the app fails at build/startup with a clear error (enforced via `src/env.ts`)

### Requirement: Portable Text body rendering
The system SHALL render Portable Text body blocks using `@portabletext/react` with a custom `components` prop that maps standard block types to Tailwind-styled elements consistent with the `prose prose-slate` appearance.

#### Scenario: Standard block types rendered
- **WHEN** a post body contains headings (h2, h3), paragraphs, bullet lists, numbered lists, bold, italic, and links
- **THEN** each block type renders with appropriate Tailwind classes matching the existing prose style

### Requirement: Existing blog dependencies removed
The system SHALL remove `gray-matter`, `next-mdx-remote`, and `src/lib/mdx.ts` once the Sanity migration is complete. The `content/blog/` directory SHALL be deleted after posts are re-entered in Sanity.

#### Scenario: Clean dependency tree
- **WHEN** the migration is complete
- **THEN** `package.json` contains no references to `gray-matter` or `next-mdx-remote`
