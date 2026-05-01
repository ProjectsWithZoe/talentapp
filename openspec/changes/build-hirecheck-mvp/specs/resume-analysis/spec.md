## ADDED Requirements

### Requirement: File upload and parsing
The system SHALL accept resume files in `.docx` and `.pdf` formats. `.docx` files SHALL be parsed client-side using mammoth.js browser build. `.pdf` files SHALL be uploaded to `/api/parse-pdf` and parsed server-side using unpdf. Both formats SHALL produce plain text passed to the analysis pipeline. Files SHALL be rejected if they exceed 5MB.

#### Scenario: DOCX upload
- **WHEN** user selects a `.docx` file on the analyze page
- **THEN** mammoth.js extracts plain text in the browser and stores it in component state without any network request

#### Scenario: PDF upload
- **WHEN** user selects a `.pdf` file on the analyze page
- **THEN** the file is sent to `/api/parse-pdf`, text is extracted via unpdf, and returned to the client

#### Scenario: Oversized file
- **WHEN** user selects a file larger than 5MB
- **THEN** the system shows an inline error and does not proceed

#### Scenario: Unsupported format
- **WHEN** user selects a file that is not `.docx` or `.pdf`
- **THEN** the system shows an inline error listing accepted formats

---

### Requirement: Analysis API
The system SHALL expose a POST `/api/analyze` route that accepts `{ resumeText: string, jobDescription: string }` and streams a structured analysis response using the Vercel AI SDK `streamText` with tool-use (Zod schema) to guarantee valid JSON output.

#### Scenario: Successful analysis
- **WHEN** an authenticated user with remaining entitlement calls `/api/analyze` with valid resume text and job description
- **THEN** the API streams a structured JSON object matching the analysis schema

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated request hits `/api/analyze`
- **THEN** the API returns HTTP 401

#### Scenario: Entitlement exhausted
- **WHEN** a free user who has already used their one free report calls `/api/analyze`
- **THEN** the API returns HTTP 403 with `{ error: "entitlement_exhausted" }`

#### Scenario: Claude output validation failure
- **WHEN** Claude returns output that fails Zod schema validation
- **THEN** the system retries once with a simplified prompt; if the retry also fails, returns HTTP 500 with `{ error: "analysis_failed" }`

---

### Requirement: Analysis output schema
The analysis SHALL produce a structured object with the following fields. `optimizedBullets` SHALL only be populated when the requesting user has `tier = 'lifetime'`.

```
atsScore: number (0–100)
recruiterFit: "Likely to shortlist" | "Competitive" | "Borderline" | "Unlikely"
strongMatches: string[]
missingSkills: string[]
rejectionRisks: string[]
recruiterPerception: string
fixes: string[] (3–5 items)
optimizedBullets: string[] | null
```

#### Scenario: Free user analysis
- **WHEN** a free tier user receives analysis results
- **THEN** `optimizedBullets` is `null` in the response

#### Scenario: Lifetime user analysis
- **WHEN** a lifetime tier user receives analysis results
- **THEN** `optimizedBullets` contains rewritten bullet points from the resume

---

### Requirement: Claude prompt framing
Claude SHALL be prompted to act simultaneously as a senior recruiter, a simulated ATS system, and a hiring manager. The system prompt SHALL make explicit that `atsScore` reflects keyword and format alignment only (not a real ATS), and `recruiterFit` reflects human hiring manager judgment.

#### Scenario: Prompt includes role framing
- **WHEN** the analysis API constructs the Claude prompt
- **THEN** the system prompt includes explicit recruiter, ATS, and hiring manager framing

#### Scenario: atsScore is distinct from interview probability
- **WHEN** analysis results are generated
- **THEN** `atsScore` is a numeric keyword/format match score and `recruiterFit` is a qualitative shortlist likelihood — not a combined "interview probability" percentage
