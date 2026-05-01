## ADDED Requirements

### Requirement: MDX blog at /blog
The system SHALL render a blog at `/blog` using `.mdx` files stored under `/content/blog/`. Each post SHALL have frontmatter with `title`, `description`, `date`, `slug`, and `keywords`. The blog index at `/blog` SHALL list all posts sorted by date descending.

#### Scenario: Blog index page
- **WHEN** a visitor navigates to `/blog`
- **THEN** a list of all published posts is shown with title, date, and description

#### Scenario: Individual post page
- **WHEN** a visitor navigates to `/blog/[slug]`
- **THEN** the MDX content is rendered with proper heading hierarchy and semantic HTML

---

### Requirement: Blog SEO metadata
Each blog post SHALL have a unique `<title>` and `<meta name="description">` derived from its frontmatter. The post SHALL include structured data (JSON-LD `Article` schema) for search engine rich results.

#### Scenario: Post meta tags
- **WHEN** a blog post page is crawled
- **THEN** the `<title>` matches the post's frontmatter `title` and `<meta description>` matches the frontmatter `description`

---

### Requirement: Initial blog content
The repository SHALL ship with at least 3 initial MDX blog posts targeting long-tail SEO keywords relevant to tech job seekers in the US, UK, CA, and AU markets.

#### Scenario: Initial posts present
- **WHEN** the application is deployed
- **THEN** at least 3 blog posts exist at `/blog` covering topics such as ATS systems, UK/AU tech CV formats, or resume writing for software engineering roles
