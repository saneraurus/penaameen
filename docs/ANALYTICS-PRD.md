# PENA AMEEN Analytics Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Provider-agnostic measurement requirements. No analytics, tag-management, product-analytics, warehouse, consent-management, or reporting provider is selected.

## 1. Purpose

The future platform should make the customer journey and operational commerce loop measurable enough to evaluate product discoverability, content-to-commerce progression, checkout friction, payment outcomes, shipping operations, and SEO migration health.

Analytics must support decisions without inventing numerical KPIs, retaining unnecessary personal data, or treating a measurement event as a business-state authority.

## 2. Measurement principles

1. **Business state remains authoritative elsewhere.** Analytics may observe `payment_success`; verified payment/order records remain the authority.
2. **Measure the funnel, not only purchase.** Discovery, search, product evaluation, cart, checkout, payment, shipping, and post-purchase steps all matter.
3. **Do not invent KPI targets.** Baseline, target, cadence, and accountable owner are CLIENT DECISION REQUIRED.
4. **Minimize personal data.** Events must avoid unnecessary names, addresses, payment credentials, full order details, raw query data, or sensitive identifiers.
5. **Respect consent and legal policy.** Existing analytics, consent, privacy policy, Search Console access, and retention policy are UNKNOWN.
6. **Plan for migration continuity.** Existing important landing URLs, redirects, 404s, index coverage, and content/product discovery need measurement after launch.

## 3. Requirements

| Requirement ID | Requirement | Priority | Status | Dependency |
|---|---|---|---|---|
| REQ-ANL-001 | Capture eligible public discovery, content, product, cart, checkout, and purchase funnel events. | MUST HAVE | CONFIRMED product requirement | Analytics/consent decision, event instrumentation later |
| REQ-ANL-002 | Capture search behavior, including product search and meaningful zero-result/refinement behavior, subject to privacy policy. | MUST HAVE | CONFIRMED product requirement | Search scope, analytics/privacy policy |
| REQ-ANL-003 | Capture payment and shipping lifecycle observability events without treating analytics as financial/operational truth. | MUST HAVE | PROPOSED | Payment/shipping event model, privacy |
| REQ-ANL-004 | Enable post-launch monitoring of priority URL availability, redirects, 404s, sitemap/indexing signals, and relevant SEO outcomes. | MUST HAVE | CONFIRMED migration requirement | Search Console/SEO analytics access, redirect matrix |
| REQ-ANL-005 | Support promotion/coupon measurement only if promotions/coupons are approved. | CLIENT DECISION REQUIRED | BLOCKED | Promotion policy |
| REQ-ANL-006 | Select analytics/consent provider(s), retention, identities, dashboards, access, and targets with PENA AMEEN. | CLIENT DECISION REQUIRED | BLOCKED | Client/legal/marketing/technical decision |

## 4. Minimum event catalogue

The event names below are conceptual and may be mapped to a future provider’s naming convention. They define what should eventually be measurable, not an implementation schema.

| Event | Trigger / meaning | Useful non-sensitive context (examples) | Priority |
|---|---|---|---|
| `page_view` | Eligible public page becomes viewable | Page type, canonical/content ID where approved, referrer category | MUST HAVE |
| `category_view` | A retained product/content category/archive is viewed | Category/archive ID/slug, page type | MUST HAVE |
| `product_view` | Product detail is viewed | Product ID/slug/category/method context; no inventory/PII | MUST HAVE |
| `search` | A public search query is submitted | Scope, normalized privacy-safe query treatment, result count bucket, filter state | MUST HAVE |
| `product_search` | Search results include/are scoped to product discovery | Query context subject to policy, result count, applied product filters | MUST HAVE |
| `search_result_selected` | User selects a result | Result type and anonymous content/product identifier | SHOULD HAVE |
| `search_zero_results` | Search yields no eligible result | Privacy-safe query treatment, scope/filter state | SHOULD HAVE |
| `add_to_cart` | Eligible product/variant is added to cart | Product/variant ID, quantity, category/context; avoid price/PII leakage beyond approved analytics policy | MUST HAVE |
| `remove_from_cart` | Cart line removed | Product/variant ID, quantity/context | SHOULD HAVE |
| `cart_view` | Cart experience viewed | Line count/order-summary state; not customer address/payment details | MUST HAVE |
| `checkout_started` | Customer enters valid checkout flow | Cart state/line count, guest/account mode only if approved | MUST HAVE |
| `checkout_step_viewed` | Customer reaches meaningful checkout step | Step type, validation/error category | SHOULD HAVE |
| `checkout_validation_error` | Validatable checkout issue blocks progression | Non-sensitive field/error category, not raw input | SHOULD HAVE |
| `shipping_quote_requested` | Valid shipping calculation request begins | Destination region bucket only if privacy approved, line/package count | MUST HAVE |
| `shipping_option_selected` | Customer selects a valid shipping option | Approved method/service identifier/cost bucket, not full address | MUST HAVE |
| `payment_started` | Payment initiation begins | Approved payment-method category, order reference token/anonymous ID as permitted | MUST HAVE |
| `payment_pending` | Payment remains awaiting verification | State category, not payment credentials | SHOULD HAVE |
| `payment_success` | Verified payment success is recorded | Order/purchase attribution using privacy-safe identifier | MUST HAVE |
| `payment_failure` | Payment fails/expires/cancels | Failure state category, method category where approved | MUST HAVE |
| `purchase` | Valid purchase/completed transaction outcome is recorded | Order/line/currency/revenue data only under approved analytics/privacy policy | MUST HAVE |
| `coupon_applied` | Approved coupon/promotion attempt/outcome | Coupon category/eligibility outcome; never assume feature exists | CLIENT DECISION REQUIRED |
| `shipment_created` | Shipment is confirmed | Shipment/order state category, method category | MUST HAVE |
| `awb_generated` | Verified AWB/resi assigned | Presence/state only as appropriate | SHOULD HAVE |
| `order_shipped` | Approved dispatch event occurs | Shipment state/method category | MUST HAVE |
| `delivery_status_updated` | Trusted tracking/delivery state changes | High-level state, no unnecessary personal data | SHOULD HAVE |
| `tracking_viewed` | Customer opens authorized tracking context | Authorized access path type / state category | SHOULD HAVE |
| `redirect_resolved` | Legacy URL returns target/redirect outcome | Source/target URL class, response class; monitoring system may own implementation | MUST HAVE migration monitoring |
| `not_found_viewed` | User reaches unresolved/retired URL state | Requested URL category/privacy-safe path, referrer context | MUST HAVE migration monitoring |

## 5. Funnel and product questions

The eventual measurement system should enable PENA AMEEN to answer questions such as:

- Which eligible pages, categories, articles, method pages, and products lead visitors into product discovery?
- What searches produce no results or lead to a product/content result?
- Where do visitors leave the cart/checkout journey, and what validation/state category is involved?
- How often do payment attempts enter pending, success, failure, expiration, or cancellation states?
- How often can shipping rates be calculated, shipments created, AWBs generated, labels made available, and tracking delivered?
- Which priority old URLs redirect correctly and which sources produce 404s after launch?
- Which content/product relationships are used, without claiming they prove causation?

The answers require approved metric definitions, baseline, targets, attribution rules, and data governance. This document does not create KPI values.

## 6. Operational and SEO observability

Analytics and observability overlap but are not identical.

### Product/operational measurement

The platform should be able to observe aggregate progression/error categories for:

- product availability/cart validation;
- shipping quote outcomes;
- payment initiation/verification outcomes;
- shipment/AWB/label/tracking outcomes;
- notification send/delivery outcomes where permitted;
- staff exception queues/workload categories where approved.

### SEO migration measurement

Post-launch monitoring should cover:

- source-to-target redirect behavior for priority URLs;
- not-found requests and referrers/categories;
- crawl/indexing/sitemap/coverage signals once Search Console or equivalent access is granted;
- priority product/category/article/branch URL availability;
- metadata/canonical/structured-data validation during QA;
- organic landing/discovery trends only when an approved analytics/SEO source is available.

## 7. Privacy, consent, and data quality

### Client decisions required

- analytics and tag-management provider(s);
- consent mechanism and legal basis;
- event-data retention and access;
- treatment of IP/device/session identifiers and cross-device identity;
- whether/how raw search queries are retained or redacted;
- whether transaction revenue/order data is sent to analytics;
- reporting dashboards, owners, and alert thresholds;
- existing analytics/Search Console continuity and migration plan.

### Data-quality requirements — PROPOSED

- Events must use consistent identifiers and documented semantics.
- Test environments must not pollute production reporting, or must be distinguishable.
- Duplicate/retried technical events must not be misread as duplicate purchases/shipments.
- Event capture failure must not block payment, order, shipment, or customer notification operations.
- Access to customer/transaction data must be restricted appropriately.
- QA must validate required events against expected business state, without making the analytics system the source of truth.

## 8. Exclusions

This PRD does not select providers or implement tracking. It does not require ad-tech retargeting, behavioral profiling, heat maps, session replay, customer-data platform, data warehouse, attribution modeling, A/B testing, marketing automation, or BI tooling for MVP. Any such work requires separate privacy, scope, and technical review.
