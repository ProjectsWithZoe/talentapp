# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-flow.spec.ts >> Payment link — unauthenticated user >> completes checkout and lands on 'Check your inbox' success page
- Location: tests/payment-flow.spec.ts:69:7

# Error details

```
TypeError: page.frameLocator(...).or is not a function
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - banner [ref=e6]:
      - generic [ref=e8]:
        - heading "Talentapp sandbox" [level=1] [ref=e10]
        - generic [ref=e11]: Sandbox
    - generic [ref=e14]:
      - heading "lifetime" [level=2] [ref=e15]:
        - generic [ref=e17]: lifetime
      - generic [ref=e22]: £29.99
  - generic [ref=e23]:
    - main [ref=e24]:
      - generic [ref=e27]:
        - generic:
          - iframe [ref=e33]:
            
          - generic [ref=e34]:
            - separator [ref=e35]
            - paragraph [ref=e36]: Or
        - heading "Contact information" [level=2] [ref=e37]
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e44]:
            - generic [ref=e46]: Email
            - textbox "Email" [active] [ref=e53]:
              - /placeholder: email@example.com
              - text: playwright+1778086590138@example.com
          - heading "Payment method" [level=2] [ref=e55]
        - generic [ref=e56]:
          - list [ref=e57]:
            - listitem [ref=e62]:
              - generic [ref=e71]:
                - generic [ref=e75]:
                  - radio "Card" [ref=e76]
                  - generic [ref=e78]: Card
                  - generic:
                    - generic:
                      - generic:
                        - img "Visa"
                    - generic:
                      - generic:
                        - img "MasterCard"
                    - generic:
                      - generic:
                        - img "American Express"
                    - generic:
                      - img "UnionPay"
                      - img "JCB"
                      - img "Discover"
                      - img "Diners Club"
                - generic:
                  - button "Pay with card"
            - listitem [ref=e83]:
              - generic [ref=e92]:
                - generic [ref=e96]:
                  - radio "Klarna" [ref=e97]
                  - generic [ref=e99]: Klarna
                - generic:
                  - button "Pay with Klarna"
            - listitem [ref=e104]:
              - generic [ref=e113]:
                - generic [ref=e117]:
                  - radio "Revolut Pay" [ref=e118]
                  - generic [ref=e120]: Revolut Pay
                - generic:
                  - button "Pay with Revolut"
          - generic [ref=e133]:
            - checkbox "Save my information for faster checkout" [ref=e135] [cursor=pointer]
            - generic [ref=e136]:
              - generic [ref=e139] [cursor=pointer]: Save my information for faster checkout
              - generic [ref=e141]: Pay securely at Talentapp sandbox and everywhere Link is accepted.
        - button "Pay" [ref=e146] [cursor=pointer]:
          - generic:
            - generic [ref=e148]: Pay
            - generic [ref=e149]: Processing
          - img [ref=e154]
          - img [ref=e159]
      - generic [ref=e161]:
        - checkbox "I am an AI agent acting on behalf of someone else" [ref=e162]
        - text: I am an AI agent acting on behalf of someone else
    - contentinfo [ref=e164]:
      - link "Powered by Stripe" [ref=e166] [cursor=pointer]:
        - /url: https://stripe.com
        - generic [ref=e167]:
          - text: Powered by
          - img "Stripe" [ref=e169]
      - link "Terms" [ref=e172] [cursor=pointer]:
        - /url: https://stripe.com/legal/end-users
      - link "Privacy" [ref=e173] [cursor=pointer]:
        - /url: https://stripe.com/privacy
```

# Test source

```ts
  1   | /**
  2   |  * E2E Payment Flow Tests
  3   |  *
  4   |  * Requires:
  5   |  *   - NEXT_PUBLIC_STRIPE_PAYMENT_LINK in .env (must be a test mode Payment Link)
  6   |  *   - STRIPE_SECRET_KEY in .env (must be sk_test_*)
  7   |  *   - Dev server running (handled by webServer in playwright.config.ts)
  8   |  *
  9   |  * The Stripe E2E tests use card 4242 4242 4242 4242 (always succeeds in test mode).
  10  |  * They create real rows in your database via /api/activate. Use a test DB or clean up after.
  11  |  */
  12  | 
  13  | import { test, expect, type Page } from "@playwright/test";
  14  | 
  15  | const TEST_EMAIL = `playwright+${Date.now()}@example.com`;
  16  | const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  17  | const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  18  | 
  19  | // Stripe test card details (always succeeds in test mode)
  20  | const CARD = {
  21  |   number: "4242424242424242",
  22  |   expiry: "1234",
  23  |   cvc: "123",
  24  |   zip: "10001",
  25  |   name: "Test User",
  26  | };
  27  | 
  28  | // ---------------------------------------------------------------------------
  29  | // Helper: fill Stripe card fields (handles their iframe layout)
  30  | // ---------------------------------------------------------------------------
  31  | async function fillStripeCard(page: Page) {
  32  |   // Stripe renders card fields inside iframes. Try each common locator pattern.
  33  |   // The outer iframe contains a sub-frame with the actual input.
  34  |   const numberFrame = page
  35  |     .frameLocator('[data-elements-stable-field-name="cardNumber"] iframe')
> 36  |     .or(page.frameLocator('iframe[title*="card number" i]'))
      |      ^ TypeError: page.frameLocator(...).or is not a function
  37  |     .or(page.frameLocator('iframe[name*="privateStripeFrame"]').first());
  38  | 
  39  |   // Some Stripe layouts render outside iframes in a single-page checkout
  40  |   const directNumber = page.locator('[data-elements-stable-field-name="cardNumber"] input, input[placeholder*="1234"]').first();
  41  | 
  42  |   if (await directNumber.isVisible({ timeout: 3_000 }).catch(() => false)) {
  43  |     await directNumber.fill(CARD.number);
  44  |     await page.locator('[data-elements-stable-field-name="cardExpiry"] input, input[placeholder*="MM"]').first().fill(CARD.expiry);
  45  |     await page.locator('[data-elements-stable-field-name="cardCvc"] input, input[placeholder="CVC"]').first().fill(CARD.cvc);
  46  |   } else {
  47  |     await numberFrame.locator('input[name="number"]').fill(CARD.number);
  48  |     await page.frameLocator('iframe[title*="expiration" i]').or(
  49  |       page.frameLocator('[data-elements-stable-field-name="cardExpiry"] iframe')
  50  |     ).locator('input').fill(CARD.expiry);
  51  |     await page.frameLocator('iframe[title*="CVC" i]').or(
  52  |       page.frameLocator('[data-elements-stable-field-name="cardCvc"] iframe')
  53  |     ).locator('input').fill(CARD.cvc);
  54  |   }
  55  | 
  56  |   // ZIP (optional — not always shown)
  57  |   const zipInput = page.locator('input[placeholder="ZIP"], input[name="postalCode"]').first();
  58  |   if (await zipInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
  59  |     await zipInput.fill(CARD.zip);
  60  |   }
  61  | }
  62  | 
  63  | // ---------------------------------------------------------------------------
  64  | // Stripe E2E — full payment link flow
  65  | // ---------------------------------------------------------------------------
  66  | test.describe("Payment link — unauthenticated user", () => {
  67  |   test.skip(!PAYMENT_LINK, "NEXT_PUBLIC_STRIPE_PAYMENT_LINK not set");
  68  | 
  69  |   test("completes checkout and lands on 'Check your inbox' success page", async ({ page }) => {
  70  |     test.setTimeout(90_000); // Stripe checkout can be slow
  71  | 
  72  |     // Navigate to the Stripe-hosted Payment Link
  73  |     await page.goto(PAYMENT_LINK!);
  74  |     await page.waitForLoadState("domcontentloaded");
  75  |     // Give Stripe's JS time to render the form (networkidle never fires on stripe.com)
  76  |     await page.waitForTimeout(3_000);
  77  | 
  78  |     // Fill email (Stripe collects this on Payment Links)
  79  |     const emailField = page.locator('input[type="email"], input[name="email"]').first();
  80  |     if (await emailField.isVisible({ timeout: 5_000 }).catch(() => false)) {
  81  |       await emailField.fill(TEST_EMAIL);
  82  |     }
  83  | 
  84  |     // Fill name if asked
  85  |     const nameField = page.locator('input[name="name"], input[placeholder*="Name" i]').first();
  86  |     if (await nameField.isVisible({ timeout: 2_000 }).catch(() => false)) {
  87  |       await nameField.fill(CARD.name);
  88  |     }
  89  | 
  90  |     await fillStripeCard(page);
  91  | 
  92  |     // Submit payment
  93  |     const payButton = page
  94  |       .locator('button[type="submit"]')
  95  |       .or(page.getByRole("button", { name: /pay|subscribe|continue/i }))
  96  |       .first();
  97  |     await payButton.click();
  98  | 
  99  |     // Wait for Stripe to redirect back to our /success page
  100 |     await page.waitForURL(`${BASE_URL}/success**`, { timeout: 30_000 });
  101 |     await page.waitForLoadState("networkidle");
  102 | 
  103 |     // Unauthenticated payer → "Check your inbox" branch
  104 |     await expect(page.getByText("Payment confirmed")).toBeVisible({ timeout: 10_000 });
  105 |     await expect(page.getByText(/Check your inbox/i)).toBeVisible();
  106 |     await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  107 | 
  108 |     // No "Start analysing" button (that's the signed-in branch)
  109 |     await expect(page.getByRole("link", { name: /Start analysing/i })).not.toBeVisible();
  110 |   });
  111 | });
  112 | 
  113 | // ---------------------------------------------------------------------------
  114 | // Success page — edge cases (no real Stripe needed)
  115 | // ---------------------------------------------------------------------------
  116 | test.describe("Success page — edge cases", () => {
  117 |   test("redirects to /analyze when session_id is absent", async ({ page }) => {
  118 |     await page.goto("/success");
  119 |     await expect(page).toHaveURL(/\/analyze/);
  120 |   });
  121 | 
  122 |   test("redirects to /analyze when session_id is invalid", async ({ page }) => {
  123 |     // /api/activate returns 400 for bad session → success page redirects
  124 |     await page.goto("/success?session_id=cs_test_invalid_fake_id");
  125 |     await expect(page).toHaveURL(/\/analyze/, { timeout: 15_000 });
  126 |   });
  127 | });
  128 | 
  129 | // ---------------------------------------------------------------------------
  130 | // Homepage — pricing section visibility
  131 | // ---------------------------------------------------------------------------
  132 | test.describe("Homepage pricing section", () => {
  133 |   test("shows pricing section for unauthenticated users", async ({ page }) => {
  134 |     await page.goto("/");
  135 |     await page.waitForLoadState("networkidle");
  136 | 
```