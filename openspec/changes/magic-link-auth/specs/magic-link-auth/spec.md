## ADDED Requirements

### Requirement: User can sign in or sign up via magic link email
The system SHALL authenticate users (new and returning) through a passwordless email magic link flow. The user provides only their email address; the system sends a time-limited link; clicking the link creates an authenticated session.

#### Scenario: New user requests magic link
- **WHEN** an unauthenticated user submits a valid email address that has no existing account
- **THEN** the system creates a new user record, sends a magic link email to that address, and displays a "check your inbox" confirmation state

#### Scenario: Returning user requests magic link
- **WHEN** an unauthenticated user submits a valid email address that has an existing account
- **THEN** the system sends a magic link email to that address and displays a "check your inbox" confirmation state

#### Scenario: User clicks a valid magic link
- **WHEN** the user clicks a magic link that has not expired and has not been used
- **THEN** the system creates an authenticated session and redirects the user to the page they were on (or home if no callback URL is set)

#### Scenario: User clicks an expired or invalid magic link
- **WHEN** the user clicks a magic link that has expired or is otherwise invalid
- **THEN** the system displays an error message and prompts the user to request a new link

### Requirement: Auth UI is presented as a modal
The system SHALL display the email input form and the "check your inbox" confirmation as a modal overlay, without navigating away from the current page, preserving any in-progress form state on the underlying page.

#### Scenario: User triggers auth modal from analyze page
- **WHEN** an unauthenticated user on `/analyze` triggers the auth flow (e.g., attempts to run an analysis)
- **THEN** the auth modal opens on top of the page without losing the uploaded resume or job description text

#### Scenario: User dismisses the modal
- **WHEN** the user closes the auth modal without completing sign-in
- **THEN** the modal closes and the underlying page state is preserved

### Requirement: Email is delivered via Resend
The system SHALL use the Resend API to deliver magic link emails. The email SHALL include the magic link and a brief instruction. The `RESEND_API_KEY` environment variable MUST be present; its absence SHALL crash the server at startup via the existing env validation.

#### Scenario: Resend API key is missing at startup
- **WHEN** the application starts without `RESEND_API_KEY` set
- **THEN** the server throws an error and refuses to start

#### Scenario: Magic link email is delivered
- **WHEN** a user requests a magic link and Resend is configured
- **THEN** the user receives an email containing a clickable sign-in link within a reasonable time (< 30 seconds under normal conditions)

### Requirement: Only magic link auth is supported
The system SHALL NOT offer email/password sign-in, password reset, or OAuth sign-in flows. The auth UI SHALL contain only an email input and submit button.

#### Scenario: User attempts to access a removed auth method
- **WHEN** a request is made to any email/password or OAuth auth endpoint
- **THEN** the system returns a 404 or method-not-allowed response (no handler registered)
