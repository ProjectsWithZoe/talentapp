## ADDED Requirements

### Requirement: Conversion-focused hero section
The landing page (`/`) SHALL have a hero section with a clear value proposition headline, a sub-headline addressing the pain point (resume rejection / ATS black holes), and a primary CTA button linking to `/analyze`. Copy SHALL target tech job seekers in the US, UK, Canada, and Australia.

#### Scenario: Hero CTA
- **WHEN** a visitor lands on `/`
- **THEN** the hero section is immediately visible with the primary CTA above the fold

#### Scenario: CTA destination
- **WHEN** a visitor clicks the primary CTA
- **THEN** they are taken to `/analyze`

---

### Requirement: Social proof and feature highlights
The landing page SHALL include a features section explaining the analysis outputs (ATS score, recruiter fit, rejection risks, etc.) and at minimum one social proof element (testimonial, result example, or "used by X job seekers" counter).

#### Scenario: Features visible
- **WHEN** visitor scrolls past the hero
- **THEN** a features section explains each analysis output with brief descriptions

---

### Requirement: SEO metadata
The landing page SHALL include a descriptive `<title>`, `<meta name="description">`, and Open Graph tags optimised for long-tail keywords targeting tech job seekers. Page content SHALL use semantic HTML (`<h1>`, `<h2>`, etc.).

#### Scenario: Meta tags present
- **WHEN** the landing page is crawled
- **THEN** `<title>` and `<meta name="description">` contain target keywords relevant to ATS resume checking for tech roles

---

### Requirement: Pricing section
The landing page SHALL display the pricing tiers: Free (1 analysis) and Lifetime (£99, unlimited + optimizedBullets). The Lifetime tier CTA SHALL initiate the sign-in → checkout flow.

#### Scenario: Pricing visible
- **WHEN** visitor scrolls to the pricing section
- **THEN** both tiers are displayed with their features and CTAs

#### Scenario: Lifetime CTA
- **WHEN** visitor clicks "Get Lifetime Access" on the landing page
- **THEN** sign-in modal opens (if unauthenticated) then redirects to Stripe Checkout
