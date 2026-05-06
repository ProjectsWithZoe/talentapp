/**
 * E2E Payment Flow Tests
 *
 * Requires:
 *   - NEXT_PUBLIC_STRIPE_PAYMENT_LINK in .env (must be a test mode Payment Link)
 *   - STRIPE_SECRET_KEY in .env (must be sk_test_*)
 *   - Dev server running (handled by webServer in playwright.config.ts)
 *
 * The Stripe E2E tests use card 4242 4242 4242 4242 (always succeeds in test mode).
 * They create real rows in your database via /api/activate. Use a test DB or clean up after.
 */

import { test, expect, type Page } from "@playwright/test";

const TEST_EMAIL = `playwright+${Date.now()}@example.com`;
const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Stripe test card details (always succeeds in test mode)
const CARD = {
  number: "4242424242424242",
  expiry: "1234",
  cvc: "123",
  zip: "10001",
  name: "Test User",
};

// ---------------------------------------------------------------------------
// Helper: fill Stripe card fields (handles their iframe layout)
// ---------------------------------------------------------------------------
async function fillStripeCard(page: Page) {
  // Stripe renders card fields inside iframes. Try each common locator pattern.
  // The outer iframe contains a sub-frame with the actual input.
  const numberFrame = page
    .frameLocator('[data-elements-stable-field-name="cardNumber"] iframe')
    .or(page.frameLocator('iframe[title*="card number" i]'))
    .or(page.frameLocator('iframe[name*="privateStripeFrame"]').first());

  // Some Stripe layouts render outside iframes in a single-page checkout
  const directNumber = page.locator('[data-elements-stable-field-name="cardNumber"] input, input[placeholder*="1234"]').first();

  if (await directNumber.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await directNumber.fill(CARD.number);
    await page.locator('[data-elements-stable-field-name="cardExpiry"] input, input[placeholder*="MM"]').first().fill(CARD.expiry);
    await page.locator('[data-elements-stable-field-name="cardCvc"] input, input[placeholder="CVC"]').first().fill(CARD.cvc);
  } else {
    await numberFrame.locator('input[name="number"]').fill(CARD.number);
    await page.frameLocator('iframe[title*="expiration" i]').or(
      page.frameLocator('[data-elements-stable-field-name="cardExpiry"] iframe')
    ).locator('input').fill(CARD.expiry);
    await page.frameLocator('iframe[title*="CVC" i]').or(
      page.frameLocator('[data-elements-stable-field-name="cardCvc"] iframe')
    ).locator('input').fill(CARD.cvc);
  }

  // ZIP (optional — not always shown)
  const zipInput = page.locator('input[placeholder="ZIP"], input[name="postalCode"]').first();
  if (await zipInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await zipInput.fill(CARD.zip);
  }
}

// ---------------------------------------------------------------------------
// Stripe E2E — full payment link flow
// ---------------------------------------------------------------------------
test.describe("Payment link — unauthenticated user", () => {
  test.skip(!PAYMENT_LINK, "NEXT_PUBLIC_STRIPE_PAYMENT_LINK not set");

  test("completes checkout and lands on 'Check your inbox' success page", async ({ page }) => {
    test.setTimeout(90_000); // Stripe checkout can be slow

    // Navigate to the Stripe-hosted Payment Link
    await page.goto(PAYMENT_LINK!);
    await page.waitForLoadState("domcontentloaded");
    // Give Stripe's JS time to render the form (networkidle never fires on stripe.com)
    await page.waitForTimeout(3_000);

    // Fill email (Stripe collects this on Payment Links)
    const emailField = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailField.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await emailField.fill(TEST_EMAIL);
    }

    // Fill name if asked
    const nameField = page.locator('input[name="name"], input[placeholder*="Name" i]').first();
    if (await nameField.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await nameField.fill(CARD.name);
    }

    await fillStripeCard(page);

    // Submit payment
    const payButton = page
      .locator('button[type="submit"]')
      .or(page.getByRole("button", { name: /pay|subscribe|continue/i }))
      .first();
    await payButton.click();

    // Wait for Stripe to redirect back to our /success page
    await page.waitForURL(`${BASE_URL}/success**`, { timeout: 30_000 });
    await page.waitForLoadState("networkidle");

    // Unauthenticated payer → "Check your inbox" branch
    await expect(page.getByText("Payment confirmed")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Check your inbox/i)).toBeVisible();
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();

    // No "Start analysing" button (that's the signed-in branch)
    await expect(page.getByRole("link", { name: /Start analysing/i })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Success page — edge cases (no real Stripe needed)
// ---------------------------------------------------------------------------
test.describe("Success page — edge cases", () => {
  test("redirects to /analyze when session_id is absent", async ({ page }) => {
    await page.goto("/success");
    await expect(page).toHaveURL(/\/analyze/);
  });

  test("redirects to /analyze when session_id is invalid", async ({ page }) => {
    // /api/activate returns 400 for bad session → success page redirects
    await page.goto("/success?session_id=cs_test_invalid_fake_id");
    await expect(page).toHaveURL(/\/analyze/, { timeout: 15_000 });
  });
});

// ---------------------------------------------------------------------------
// Homepage — pricing section visibility
// ---------------------------------------------------------------------------
test.describe("Homepage pricing section", () => {
  test("shows pricing section for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("#pricing")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /Simple pricing/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Get lifetime access/i })).toBeVisible();
  });

  test("hides pricing section for lifetime users", async ({ page }) => {
    // NOTE: PricingSection is a Server Component — it calls auth.api.getSession()
    // on the Next.js server using the incoming request cookie. page.route() only
    // intercepts browser-level fetches, not server-side calls, so we cannot mock
    // the tier here without a real DB-backed session.
    //
    // To run this test: complete a payment (use the Stripe E2E test above), then
    // copy the better-auth session cookie from the browser into storageState.json
    // and pass it to the test via `use: { storageState: 'storageState.json' }`.
    test.skip(true, "Requires a real DB-backed lifetime session cookie — see comment above");
  });
});

// ---------------------------------------------------------------------------
// Analyze page — entitlement exhausted banner links to /#pricing
// ---------------------------------------------------------------------------
test.describe("Analyze page — upgrade link", () => {
  test("error banner links to /#pricing when entitlement is exhausted", async ({ page }) => {
    // Mock a signed-in free user who has already used their one free report
    await page.route("**/api/auth/get-session", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          session: {
            id: "s1",
            userId: "u1",
            expiresAt: new Date(Date.now() + 86400_000).toISOString(),
            token: "tok",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          user: {
            id: "u1",
            email: "free-exhausted@example.com",
            name: "Free User",
            emailVerified: true,
            tier: "free",
            freeReportUsed: true,   // already used → no warning modal, goes straight to analyze
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      })
    );

    // Mock the analyze API to return entitlement exhausted
    await page.route("**/api/analyze", (route) =>
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "entitlement_exhausted" }),
      })
    );

    await page.goto("/analyze");
    await page.waitForLoadState("networkidle");

    // Fill minimum content to enable the submit button
    await page.locator("textarea").nth(0).fill("A".repeat(110));
    await page.locator("textarea").nth(1).fill("B".repeat(55));

    // Submit — no warning modal since freeReportUsed=true, goes straight to API
    await page.getByRole("button", { name: /Analyse my resume/i }).click();

    // Error banner should appear with the correct href
    const upgradeLink = page.getByRole("link", { name: /Upgrade to lifetime access/i });
    await expect(upgradeLink).toBeVisible({ timeout: 5_000 });
    await expect(upgradeLink).toHaveAttribute("href", "/#pricing");
  });
});
