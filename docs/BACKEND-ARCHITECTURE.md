# PENA AMEEN Backend Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED backend/domain blueprint. It defines modules, service responsibilities, transactional rules, provider ports, and recovery behavior; it does not create APIs, jobs, schema, authentication, integrations, or implementation code.

## 1. Backend architecture model

The backend is an application-service layer inside the modular monolith. HTTP routes, Server Actions, admin commands, worker jobs, and webhooks are delivery mechanisms; they call the same domain/application services rather than each carrying its own commerce logic.

```text
Delivery adapter (page/API/webhook/worker)
→ authentication and request context
→ validation
→ application service / transaction boundary
→ domain policy
→ repository and outbox
→ provider port or response
```

## 2. Domain modules

| Module | Core responsibility | Owns authoritative decisions | Provider/dependency boundary |
|---|---|---|---|
| Catalog | Product/category/tag/attribute/media publication and retrieval | Active/public product/content eligibility | Media, search indexing |
| Inventory | Available/reserved stock and adjustments | Whether a valid line can be fulfilled | Warehouse data/SOP unknown |
| Cart | Guest/customer cart and line validation | Current purchasable cart state | Catalog, inventory, price policy |
| Checkout | Validated purchase orchestration | Checkout readiness and order-creation intent | Customer, inventory, shipping, payment |
| Order | Order snapshot/state machine/audit/outbox | Order lifecycle transitions | Payment, shipping, notification |
| Payment | Payment attempts, provider events, refunds/reconciliation | Payment state mapping/verification | Payment provider port UNKNOWN |
| Shipping | Rate quotes, shipment, label, AWB, tracking | Shipment/tracking state mapping | Shipping provider port UNKNOWN |
| Customer | Customer/account/address/order ownership | Private data access and profile state | Auth/consent/migration policy |
| Content | Articles/pages/taxonomy/branch/event lifecycle | Public publication and route/content relationships | Media, SEO, search |
| SEO | Metadata, canonical/indexability, redirect, sitemap decisions | Public route SEO state | Source crawl/Search Console data |
| Search | Search documents/query scopes/relevance configuration | Public result eligibility | PostgreSQL/external search port |
| Notification | Notification intent/template/delivery audit | Which verified event should notify whom | Channel adapters/provider decisions |
| Admin | Staff commands/read models/work queues | Capability-gated operations and audit | Authorization, all domain services |
| Analytics | Domain-event observation and privacy-safe aggregates | Event envelope/readiness, not commerce truth | Analytics adapter/consent |
| Media | Media validation/reference/rights/derivative lifecycle | Media publishability and relationships | Object storage/CDN provider |

## 3. Application services

Application services are named by use case, not database table. Examples:

| Service family | Example responsibilities |
|---|---|
| Catalog service | Publish/retire product, update category membership, attach approved media, request search/SEO refresh |
| Cart service | Create/get cart, add/remove/update line, revalidate price/availability, calculate safe summary |
| Checkout service | Validate checkout intent, destination, selected shipping, payment option; create/reuse order request idempotently |
| Order service | Create order snapshot, transition workflow state, cancel under approved policy, emit outbox/audit events |
| Inventory service | Check/reserve/release/adjust stock, allocate fulfillment, reconcile returns with audit |
| Payment service | Create payment attempt, accept verified event, map provider status, request refund, reconcile exceptions |
| Shipping service | Request quote, select service, create/cancel shipment, record AWB/label/tracking event |
| Content service | Draft/publish/archive article/page, maintain taxonomy/internal links, enforce route/SEO safety |
| SEO service | Validate canonical/indexability/redirect treatment, build sitemap candidates, resolve legacy route |
| Account service | Resolve session customer, manage approved profile/address data, authorize order access |
| Admin service | Build task read models, enforce capability-gated commands, create audit logs |
| Notification service | Consume verified domain events, select approved channels/templates, record delivery/retry |

## 4. Validation architecture

Validation is layered and never trusts client input or provider payload labels blindly.

| Layer | Examples |
|---|---|
| Transport | JSON/form shape, content length, field type, upload size/type |
| Identity | Session validity, staff/customer/guest context, rate-limit context |
| Authorization | Resource ownership, role/capability, sensitive action permission |
| Domain | Product active, quantity valid, order transition allowed, category route safe |
| Concurrency | Version/conditional stock update, idempotency key, duplicate provider event prevention |
| Provider | Webhook signature, expected account/event schema, reference/amount/currency match where applicable |
| Output | Safe error code/message, no secret/PII leakage, cache/indexability controls |

## 5. Transactions and consistency

### Required transaction boundaries

- cart line mutation and authoritative cart summary update;
- order creation, order item snapshot, inventory reservation decision, payment attempt initialization intent, audit/outbox record;
- payment/shipping state transition plus corresponding audit/outbox record;
- inventory adjustment/reservation/release and ledger/audit record;
- publish/archive/redirect-sensitive content change and relevant SEO/outbox action;
- staff sensitive action and audit record.

External provider calls cannot be inside a long database transaction. Persist an intent/state first, call provider through a port, then reconcile the response/event idempotently.

## 6. Idempotency and duplicate handling

| Boundary | Idempotency key/source | Required behavior |
|---|---|---|
| Cart mutation | Client request key or compare-and-set version | Avoid duplicate quantity/line action on replay; return authoritative cart. |
| Checkout/order creation | Customer/session/request idempotency key | Same valid checkout submission returns same order intent, not duplicate order/payment attempt. |
| Payment initiation | Order/payment-attempt key | Reuse intended attempt where safe; never double-charge by blind retry. |
| Payment webhook | Provider event ID plus normalized event hash | Persist/recognize duplicate; process state transition once. |
| Shipping creation | Shipment request key/order fulfillment key | Avoid duplicate shipments/AWBs on retry. |
| Tracking event | Provider event/reference/time or normalized hash | Preserve history but avoid duplicate state/notification effect. |
| Notification delivery | Notification event/channel/template key | Avoid duplicate customer message where provider retried. |
| Admin command | Command/audit request key when sensitive | Avoid repeated refund/cancel/stock/redirect actions. |

## 7. Webhook architecture

1. Receive only at designated server webhook routes.
2. Apply request size/rate/transport controls.
3. Select the configured provider adapter only after provider configuration exists.
4. Verify signature, timestamp/replay rule, source/account context, and expected event schema.
5. Persist raw-safe receipt metadata and idempotency identifier before or atomically with processing intent.
6. Normalize to a provider-neutral payment/shipping event.
7. Process through the application service/state machine.
8. Create audit/outbox records for notifications, fulfillment, reconciliation, or alerts.
9. Return the appropriate transport acknowledgement only after durable receipt/handling policy is satisfied.
10. Quarantine malformed, unverifiable, unmatched, or conflicting events for manual review.

Exact signature algorithms, headers, retry acknowledgements, and provider event schemas remain unknown.

## 8. Background jobs, retries, and recovery

- Jobs are durable records with status, attempt count, last error category, correlation ID, retry schedule, and manual-review/dead-letter state.
- Retry only failures classified as transient; business validation/authorization failures require correction, not blind retry.
- Provider outage, rate-limit, timeout, and network failures use bounded exponential retry with alert thresholds decided later.
- Payment/shipping/notification job failure must not alter authoritative business state falsely.
- Jobs may be replayed only through idempotent service paths and authorized operational tools.

## 9. Logging, audit trails, and privacy

- Structured logs include timestamp, correlation ID, module, operation, outcome class, safe resource identifiers, and provider reference classification where appropriate.
- Audit logs capture actor, action, target, before/after summary or version, reason where required, correlation ID, and outcome.
- Logs/audits do not contain raw payment credentials, secrets, unnecessary full addresses, unredacted contact data, or raw private content by default.
- Retention, access, legal hold, and export/deletion rules require legal/security decisions.

## 10. Error/recovery ownership

| Failure domain | Immediate owner | Durable follow-up |
|---|---|---|
| Invalid user input | Delivery + application service | User correction; no worker retry |
| Inventory conflict | Inventory/order service | Cart/order recovery plus staff exception if needed |
| Payment uncertainty | Payment service | Reconciliation/manual finance review |
| Shipping failure | Shipping service | Retry/manual fulfillment queue |
| Notification failure | Notification worker | Retry/fallback/manual support per channel policy |
| SEO/redirect conflict | SEO/content service | Staff review before publication |
| Provider outage | Provider adapter + worker | Health alert/retry/fallback per approved SOP |
| Database/runtime failure | Platform/runtime operations | Correlation logging, safe error, rollback/recovery protocol |

## 11. Deferred implementation choices

Actual folder layout, ORM, queue framework, schema, validation library, API framework details, auth library, worker runner, logging stack, and provider SDKs are deferred. Any later choice must preserve this module/service/port boundary.
