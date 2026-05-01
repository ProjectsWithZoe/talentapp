## ADDED Requirements

### Requirement: Stripe Lifetime checkout
The system SHALL use Stripe Checkout for a one-time payment of £99 (GBP) for the Lifetime tier. A `/api/checkout` route SHALL create a Stripe Checkout Session with `mode: 'payment'`, the Lifetime Price ID, and the authenticated user's email pre-filled. Stripe Tax SHALL be enabled on the session to handle UK VAT, AU GST, and US sales tax automatically.

#### Scenario: Authenticated user initiates checkout
- **WHEN** an authenticated user clicks "Get Lifetime Access"
- **THEN** a POST to `/api/checkout` creates a Stripe Checkout Session and redirects to the Stripe-hosted payment page

#### Scenario: Unauthenticated checkout attempt
- **WHEN** an unauthenticated user attempts to initiate checkout
- **THEN** the system shows the sign-in modal before proceeding to checkout

#### Scenario: Stripe Tax applied
- **WHEN** a UK user completes checkout
- **THEN** Stripe Tax adds 20% VAT to the £99 base price automatically

---

### Requirement: Stripe webhook — tier upgrade
The system SHALL expose a POST `/api/webhooks/stripe` route that verifies the Stripe webhook signature and handles the `checkout.session.completed` event by setting `users.tier = 'lifetime'` for the purchasing user, matched by email.

#### Scenario: Successful payment webhook
- **WHEN** Stripe sends `checkout.session.completed` with a valid signature
- **THEN** the system sets `users.tier = 'lifetime'` for the user matching `customer_email`

#### Scenario: Invalid webhook signature
- **WHEN** a request arrives at `/api/webhooks/stripe` with an invalid or missing Stripe signature
- **THEN** the route returns HTTP 400 and no DB changes are made

#### Scenario: User not found
- **WHEN** `checkout.session.completed` fires but no user matches the email
- **THEN** the webhook logs the error and returns HTTP 200 (Stripe should not retry)

---

### Requirement: Post-payment success page
After successful Stripe checkout, users SHALL be redirected to `/success` which confirms the upgrade, shows a "Start Analyzing" CTA, and optionally surfaces an upsell (e.g., share the tool).

#### Scenario: Successful redirect
- **WHEN** Stripe redirects to the success URL after payment
- **THEN** `/success` displays a confirmation message and links to `/analyze`
