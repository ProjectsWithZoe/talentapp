## ADDED Requirements

### Requirement: Tier model
The system SHALL support two tiers: `free` and `lifetime`. All new users SHALL default to `free`. `lifetime` is granted after a successful Stripe checkout. Tier SHALL be stored as a column on the `users` table.

#### Scenario: New user default tier
- **WHEN** a new user account is created
- **THEN** `users.tier` is set to `'free'` and `users.freeReportUsed` is set to `false`

#### Scenario: Lifetime upgrade
- **WHEN** Stripe webhook confirms `checkout.session.completed` for the Lifetime product
- **THEN** `users.tier` is updated to `'lifetime'`

---

### Requirement: Free report limit
Free tier users SHALL be permitted exactly one analysis. `users.freeReportUsed` SHALL be set to `true` after the first successful analysis stream completes. Subsequent analysis requests from free users SHALL be rejected with HTTP 403.

#### Scenario: First free analysis
- **WHEN** a free user with `freeReportUsed = false` submits an analysis
- **THEN** the analysis proceeds and `freeReportUsed` is set to `true` upon stream completion

#### Scenario: Free report exhausted
- **WHEN** a free user with `freeReportUsed = true` attempts another analysis
- **THEN** the API returns HTTP 403 and the UI redirects to the upgrade CTA

---

### Requirement: Free-use warning modal
Before a free tier user submits their first analysis, the system SHALL display a modal warning that: (a) this is their one free report, (b) the report cannot be retrieved if the tab is closed, and (c) they should download the PDF before leaving.

#### Scenario: First-time free submission
- **WHEN** a free user with `freeReportUsed = false` clicks "Analyze"
- **THEN** a confirmation modal appears with the warning copy before any API call is made

#### Scenario: User confirms in modal
- **WHEN** the user clicks "Continue" in the warning modal
- **THEN** the modal closes, sign-in modal opens if unauthenticated, then analysis proceeds

#### Scenario: User dismisses modal
- **WHEN** the user clicks "Cancel" or closes the warning modal
- **THEN** no analysis is triggered and the form remains intact

---

### Requirement: `optimizedBullets` gate
The `optimizedBullets` field in analysis results SHALL only be populated for `lifetime` users. Free users SHALL receive `null` for this field. The results page SHALL render `optimizedBullets` as blurred with an upgrade CTA for free users.

#### Scenario: Free user results page
- **WHEN** a free user views their analysis results
- **THEN** the `optimizedBullets` section is visually blurred and an upgrade CTA is shown

#### Scenario: Lifetime user results page
- **WHEN** a lifetime user views their analysis results
- **THEN** the `optimizedBullets` section is fully visible with no paywall overlay
