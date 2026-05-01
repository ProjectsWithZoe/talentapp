## ADDED Requirements

### Requirement: Streaming results page
The `/results` page SHALL render analysis fields progressively as they stream from the Claude API. Each section SHALL appear as tokens arrive, giving visual feedback that analysis is in progress.

#### Scenario: Streaming in progress
- **WHEN** the analysis API is streaming
- **THEN** completed sections render immediately as their content becomes available; incomplete sections show a skeleton loader

#### Scenario: Stream complete
- **WHEN** the full analysis JSON is received
- **THEN** all sections are fully rendered and the download/share actions become available

#### Scenario: Stream error
- **WHEN** the analysis API returns an error or the stream fails
- **THEN** an error state is shown with a "Try again" CTA; `freeReportUsed` is not set to true on failure

---

### Requirement: Results layout and sections
The results page SHALL display the following sections in order: ATS Score (numeric gauge), Recruiter Fit (qualitative badge), Strong Matches (chip list), Missing Skills (chip list), Rejection Risks (warning list), Recruiter Perception (prose paragraph), Fixes (numbered list, 3–5 items), Optimized Bullets (blurred for free / visible for lifetime).

#### Scenario: ATS score display
- **WHEN** results are rendered
- **THEN** `atsScore` is shown as a number out of 100 with a visual indicator (e.g., circular gauge or progress bar)

#### Scenario: Recruiter fit badge
- **WHEN** results are rendered
- **THEN** `recruiterFit` is shown as a coloured badge: green for "Likely to shortlist", yellow for "Competitive", orange for "Borderline", red for "Unlikely"

---

### Requirement: Optimized bullets paywall
For free users, the `optimizedBullets` section SHALL be rendered with a blur overlay and an upgrade CTA. No bullet content SHALL be visible through the blur.

#### Scenario: Blur overlay on free tier
- **WHEN** a free user views results
- **THEN** the optimizedBullets section shows blurred placeholder text and a "Unlock with Lifetime — £99" button

#### Scenario: Lifetime user full access
- **WHEN** a lifetime user views results
- **THEN** optimizedBullets are fully visible with no overlay

---

### Requirement: PDF download
Users SHALL be able to download their analysis results as a PDF from the results page. PDF generation SHALL occur client-side. The download SHALL be available immediately once streaming completes.

#### Scenario: Download button click
- **WHEN** the user clicks "Download Report"
- **THEN** a PDF is generated client-side and downloaded with filename `hirecheck-report.pdf`

---

### Requirement: Shareable result card
The `/api/og` route SHALL generate a branded PNG image using `@vercel/og` from query parameters: `score`, `fit`, `role`. The results page SHALL include an Open Graph meta tag pointing to this image and a "Share Results" button that copies the URL or triggers native share.

#### Scenario: OG image generation
- **WHEN** `/api/og?score=87&fit=Likely+to+shortlist&role=Software+Engineer` is requested
- **THEN** a 1200×630 PNG is returned with hirecheck.io branding, the score, fit label, and role

#### Scenario: Share button
- **WHEN** the user clicks "Share Results"
- **THEN** the URL is copied to clipboard (or native share sheet opens on mobile) with the OG image attached
