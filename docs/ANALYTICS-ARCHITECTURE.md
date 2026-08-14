# PENA AMEEN Analytics Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED privacy-conscious measurement architecture. Analytics provider, tag manager, consent mechanism, event retention, identity model, dashboards, KPI targets, and Search Console access remain `UNKNOWN` or `CLIENT DECISION REQUIRED`. No tracking service is added.

## 1. Architecture principle

First-party domain records are authoritative for products, orders, payment, shipment, inventory, and notifications. Analytics receives privacy-safe observational events through an application-owned event envelope and optional external adapter; it cannot change commerce state.

```text
Public/customer/admin interaction or committed domain event
→ first-party event envelope / outbox
→ validation and privacy minimization
→ internal operational metric/read model
→ optional external analytics adapter after consent/provider decision
```

## 2. Event catalog

| Event | Trigger source | Minimum safe context | Exclusions |
|---|---|---|---|
| `page_view` | Eligible public route render/view | Route type, canonical/content identifier, referrer category | Raw PII, private route payloads |
| `product_view` | Product detail view | Product ID/slug/category/method context | Stock quantity, customer identity by default |
| `category_view` | Retained category/archive view | Category/archive identifier | Raw query/internal taxonomy data |
| `search` / `product_search` | Public search submission | Scope, privacy-safe query treatment, result-count bucket | Raw PII/sensitive query content unless policy approves |
| `search_result_selected` | Public result click | Result type/identifier | Full personal context |
| `search_zero_results` | No eligible result | Scope/filter/query treatment under policy | Raw sensitive queries |
| `add_to_cart` | Authoritative cart action success | Product/variant ID, quantity, category context | Customer/address/payment data |
| `cart_view` | Cart route view | Line-count/summary state bucket | Full cart contents unless approved |
| `checkout_started` | Valid checkout entry | Cart line-count/context, approved guest/account mode | Contact/address/payment values |
| `checkout_validation_error` | Server-confirmed validation category | Field/error category only | Raw entered value |
| `shipping_quote_requested` | Valid rate request begins | Region bucket only if approved; cart/package count | Full destination/address |
| `shipping_option_selected` | Valid selected option | Service/method category, cost bucket if approved | Full address/provider secrets |
| `payment_started` | Payment attempt initiated | Approved method category, anonymous order correlation | Payment credentials/references beyond policy |
| `payment_pending/success/failure` | Verified payment state event | State category, safe attribution reference | Raw transaction/provider data |
| `purchase` | Verified purchase/order milestone | Approved aggregate order/revenue context | PII unless lawful/approved |
| `shipment_created` / `awb_generated` / `order_shipped` | Verified shipping state | High-level shipment/service state | Full recipient/tracking/label data |
| `tracking_viewed` | Authorized tracking context view | Access mode/state category | Full tracking/order personal data |
| `content_engagement` | Approved content interaction | Article/hub/category identifier and interaction category | Behavioral profiling by default |
| `redirect_resolved` / `not_found_viewed` | Route/SEO system outcome | Source/target class, route category, safe referrer context | Sensitive URL/query data |
| `notification_outcome` | Notification lifecycle | Event/channel/outcome category | Message body/contact value |

Coupon events remain conditional on promotion approval.

## 3. Event envelope and delivery

Each event has a generated identifier, event name/version, occurrence time, safe actor/session context class, route/content/product/order correlation token where approved, consent state, and minimal payload. Domain-event-based commerce events originate after authoritative transaction commit through outbox/job processing. Client interaction events are validated/minimized before external forwarding.

Analytics event delivery failure must never block page render, cart, checkout, payment, order, shipment, tracking, or notification operations.

## 4. Privacy and consent architecture

- Collect the minimum data needed for approved product/operational analysis.
- Separate internal operational/audit event needs from optional marketing/third-party analytics.
- Do not send names, emails, phone numbers, full addresses, payment credentials, raw provider payloads, full order details, passwords, staff notes, or secrets to analytics by default.
- Treat IP/device/session identifiers, cross-device linking, query retention, revenue/order identifier forwarding, cookies, consent, retention, deletion, access, and regional/legal policy as client/legal decisions.
- Keep account/admin/private route activity out of public analytics unless a narrowly approved operational event exists.

## 5. SEO and migration measurement

Technical/operational measurement must support:

- redirect result and 404 category monitoring;
- sitemap/robots/canonical/indexability generation/validation status;
- priority route availability;
- search index freshness and zero-result behavior;
- eventual Search Console coverage/indexing signals after access is granted;
- pre-launch and post-launch migration exception review.

The architecture does not claim current analytics/Search Console data exists.

## 6. Business and operational metrics

| Metric group | Authoritative source | Analytics role |
|---|---|---|
| Orders/payment/revenue/refunds | Order/payment records and finance reconciliation | Aggregate/attribution observation only |
| Inventory availability | Inventory records | Operational health/event observation only |
| Shipping/tracking | Shipment/tracking records | Funnel/exception observation only |
| Conversion funnel | Product/cart/checkout/order events | Analyze journey progression subject to consent |
| Content discovery | Public route/search/content events | Analyze discovery/link behavior |
| Provider health | Adapter/job/observability records | Aggregate failure/latency signal |
| SEO migration | Redirect/404/sitemap/crawl records | Monitor regression/coverage trends |

## 7. Data quality and observability

- Event names and schemas are versioned and documented.
- Test/preview/staging events are isolated from production analytics.
- Duplicate/retried technical events cannot become duplicate purchase/shipment metrics.
- Correlation between event and authoritative resource uses safe identifiers/tokens, not raw PII.
- Missing/failed event delivery is observable but does not change business state.
- Access to internal analytics/operational metrics is capability-scoped.

## 8. Dependencies and non-goals

Provider selection, consent/legal policy, target KPIs, report ownership, marketing attribution, tag manager, heat maps, session replay, CDP, advertising pixels, behavioral profiling, warehouse, and BI tooling are not selected. They require separate scope/privacy/technical decisions.
