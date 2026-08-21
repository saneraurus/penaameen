# Step 2 Browser E2E Gate

**Status:** IMPLEMENTED LOCALLY; provider-authenticated journeys remain staging-gated.

## Covered journeys

- Public home and product navigation.
- Public cart, gallery, and contact route reachability.
- Health readiness payload and secret redaction.
- Rejection of untrusted Admin mutation origins before authentication.
- Signed-out Admin protection on trusted origin.
- Local order-history sync cannot create authoritative orders.
- Shipping fails closed when verified weight is unavailable.

## Command

```text
npm run test:e2e
```

Playwright starts or reuses the local Next.js runtime through `playwright.config.ts`. The suite intentionally does not claim provider success, payment completion, staff login, or customer ownership without staging accounts and sandbox credentials.

## Staging extension required

After isolated staging credentials are available, add authenticated journeys for Clerk sign-in, Admin product lifecycle, Sheets-backed cart resolution, address ownership, shipping provider rates, Casaku QRIS, Midtrans fallback, webhooks, Resend delivery, and mobile browser behavior.
