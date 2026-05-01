## ADDED Requirements

### Requirement: Authentication providers
The system SHALL support Google OAuth and email/password authentication via better-auth. Sessions SHALL be persisted in Neon Postgres using the better-auth Drizzle adapter.

#### Scenario: Google OAuth sign-in
- **WHEN** a user clicks "Continue with Google"
- **THEN** they are redirected through Google OAuth and returned as an authenticated session

#### Scenario: Email/password sign-up
- **WHEN** a new user submits a valid email and password via the sign-up form
- **THEN** a new user record is created and a session is established

#### Scenario: Email/password sign-in
- **WHEN** an existing user submits valid credentials
- **THEN** a session is established and the user proceeds

#### Scenario: Invalid credentials
- **WHEN** a user submits incorrect email or password
- **THEN** an inline error is shown without redirecting

---

### Requirement: Modal sign-in (form state preservation)
The sign-in flow on `/analyze` SHALL use a modal dialog (not a page redirect) so that resume text and job description entered before sign-in are not lost.

#### Scenario: Unauthenticated user clicks Analyze
- **WHEN** an unauthenticated user on `/analyze` clicks the "Analyze" button
- **THEN** a sign-in modal opens over the current page without navigation

#### Scenario: Sign-in completes inside modal
- **WHEN** the user successfully authenticates inside the modal
- **THEN** the modal closes, form state (resume text and job description) is intact, and analysis proceeds immediately

---

### Requirement: Session access in API routes
Server-side API routes SHALL retrieve the current session using better-auth's server session helpers. The session SHALL include `user.id`, `user.tier`, and `user.freeReportUsed`.

#### Scenario: Authenticated API call
- **WHEN** a request with a valid session cookie hits a protected API route
- **THEN** `auth.getSession(request)` returns the full session object including tier and freeReportUsed

#### Scenario: Expired session
- **WHEN** a request with an expired or invalid session cookie hits a protected API route
- **THEN** the session helper returns null and the route responds with HTTP 401
