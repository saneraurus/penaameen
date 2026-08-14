# PENA AMEEN Commerce UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** Provider-neutral commerce UX governance. Final pricing, stock, tax, promotion, payment, shipping, cancellation, refund, provider, and policy details remain `UNKNOWN` or `CLIENT DECISION REQUIRED`.

## 1. Commerce experience principle

The commerce experience helps a customer progress from discovery to tracking with accurate information and clear recovery. It must never use visual confidence to hide unknown or unverified product, inventory, payment, or shipment state.

```text
Shop / Search / Education content
→ Category or Product detail
→ Cart
→ Checkout
→ Payment pending or verified outcome
→ Order processing
→ Shipment / Tracking
→ Support, cancellation, return, or refund path when approved
```

## 2. Shop and category UX

| Area | User intent | Required hierarchy | Primary action | Required states | Data/policy dependency |
|---|---|---|---|---|---|
| Shop | Browse PENA AMEEN catalog | Shop context → category/filter/search → product cards | View product | loading; empty; search/refine; unavailable | Active products, taxonomy, publication state |
| Product category | Browse a meaningful retained grouping | Category title/context → products → related education context | View product | loading; empty; filter no-result; archived/redirect | Category treatment/SEO content; no invented hierarchy |
| Product tag archive | Follow retained legacy route if approved | Clear archive identity or redirect treatment | Relevant target | empty; noindex/redirect; unavailable | Tag purpose/legacy decision |
| Search | Find eligible product/content result | Query → result types → refinement/direct route | Open product/category/hub/article | empty; no result; error; loading | Search scope/relevance policy |

Product cards must show only approved title, media/fallback, current displayable price/sale state, availability representation, and route/context. Ratings, popularity, badges, savings, delivery promises, and stock quantity are not assumed.

## 3. Product detail UX

### Decision hierarchy

```text
Product identity
→ approved media
→ clear price/sale context
→ availability and valid options/packages
→ description/included content where verified
→ quantity and add-to-cart intent
→ category/education/related context
→ policy/help/support
```

| Information | UX requirement | State handling |
|---|---|---|
| Name/category/method context | Establish what product is and where it belongs | Route/category unavailable follows documented redirect/not-found treatment |
| Media | Support informed evaluation | Missing/rights/pending media uses safe fallback; no fabricated image |
| Price/sale price | Show approved current commercial context | Changed/unknown price requires review; no misleading sale treatment |
| Availability | Explain purchasability, not raw warehouse data | Unavailable/quantity conflict gives alternative/recovery path |
| SKU | Display only if customer-facing policy approves; use internally where available | Source SKU unknown; no placeholder SKU claim |
| Variant/package | Let user choose valid option/composition if confirmed | Selection incomplete/unavailable state; do not show unsupported options |
| Description/package contents | Explain approved product context | Missing/partial description remains honest; no invented benefit/content |
| Related products/content | Support adjacent discovery | Curated/source-approved relevance only; no recommendation-engine claim |
| Add to cart | Submit valid intent | Loading/authoritative success/error/unavailable; no reservation promise |

## 4. Pricing, stock, variants, and packages

| Topic | UX rule | Unknown boundary |
|---|---|---|
| Price | Label current regular/sale context clearly and accessibly | Currency, tax, fee, rounding, promotion and price-lock rules unknown |
| Previous/sale price | Use only when validated active sale data exists | Sale schedule/eligibility/savings formula unknown |
| Stock | Communicate approved availability state, not unverified quantity | Stock quantity, backorder, preorder, thresholds unknown |
| Variant | Use explicit selection controls only if product variant data is confirmed | Variants/options/SKU/price/stock source unknown |
| Package | Explain included components and selection only when approved | Package composition/configurability/stock allocation unknown |
| Quantity | Offer allowed quantity control with server revalidation | Limits, cart reservation, availability policy unknown |

## 5. Related product and content UX

Related items appear because source data or editorial relation supports a user decision:

- Product → same meaningful category, relevant education hub/article, approved related product.
- Article/Education hub → relevant category/product only when the relation is editorially appropriate.
- Do not show unrelated grids, behavioral recommendations, claimed “best sellers,” or product bundles without approved data.

## 6. Cart UX

| Requirement | UX behavior |
|---|---|
| Item review | Show product snapshot, selected valid option/package, quantity, line commercial context, remove/edit affordance |
| Quantity edit | Provide clear control, loading/authoritative response, availability/error recovery |
| Summary | Distinguish item subtotal, approved discount if any, selected/estimated shipping context, final payable total when valid |
| Empty cart | Explain no items and route to Shop/Search without blame |
| Changed item | Explain product/quantity/price/promotion/availability change; require review before checkout |
| Shipping estimate | Explain whether unavailable, estimate, selected, stale, or error; do not invent a rate |
| Continue shopping | Preserve a clear return path without hiding checkout readiness |

## 7. Checkout and payment UX boundary

Checkout uses the focused architecture in `docs/CHECKOUT-UX.md`. Commerce UX requires:

- cart-to-checkout transition only from valid cart state;
- clear customer/delivery/shipping/payment/review steps;
- visible policy/help links where approved;
- pending state after payment initiation until verified evidence arrives;
- no client/browser-only payment success confirmation;
- retry/correct/support recovery for stock, address, shipping quote, payment, session, and provider error states.

## 8. Order, shipping, and tracking UX

| Stage | Customer-facing requirement | Not allowed |
|---|---|---|
| Order created | Reference and truthful next step | Claim paid if payment is pending |
| Payment pending | Explain current pending state/action | Imply shipment readiness |
| Paid/processing | Explain fulfillment expectation in approved language | Invent delivery date/service level |
| Shipment created/AWB | Show verified tracking context when available | Treat AWB as dispatch/delivery proof |
| Shipped/in transit | Show normalized trusted state and tracking/support route | Show raw provider code as only explanation |
| Delivered | Show verified completion/support path | Invent proof-of-delivery details |
| Exception | Explain problem/support next path | Blame customer/carrier or hide status |
| Cancellation/refund/return | Show approved state/policy/support path | Promise amount/timing/eligibility not verified |

## 9. Failure, retry, and manual-review UX

- Payment initiation failure: preserve cart/order context according to policy; explain retry/alternative/support without false paid state.
- Payment expiry/cancellation: show exact known state and permitted next action; do not assume order/cart retention rule.
- Shipping rate failure/no service: request correction/retry/support; do not substitute an invented method/cost.
- Shipment/AWB/label/tracking failure: customer sees conservative processing/unavailable status; staff sees authorized exception task.
- Inventory conflict: return to a valid cart/checkout state and explain changed availability.
- Duplicate submission: show authoritative pending/known result, not a second order/charge action.

## 10. Responsive and accessibility rules

- Product decision order remains name → price/availability → selection → action on compact view.
- Cart summary follows editable items on compact view and never blocks line editing.
- Checkout/payment/tracking content uses readable, single-task hierarchy on mobile.
- Status uses text, icon/semantic markup, and color role; controls are keyboard/touch accessible.
- Media/gallery controls have accessible alternatives; product information is never image-only.

## 11. Provider neutrality

No payment gateway, courier, payment method, COD/manual payment flow, rate, delivery time, coupon, tax, free shipping, refund process, return label, or carrier UI is designed as final. The UX consumes normalized application states from Phase 3/4 architecture.
