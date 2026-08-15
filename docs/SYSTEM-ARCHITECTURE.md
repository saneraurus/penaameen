# PENA AMEEN System Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED modular-monolith system blueprint. Payment and shipping are provider-agnostic by requirement; external-service providers remain unknown unless explicitly confirmed later.

## 1. System boundary

PENA AMEEN is one single-vendor digital-commerce system with three runtime responsibilities:

1. **Web application** — public SSR/SEO pages, customer/account routes, admin routes, APIs, and webhook ingress.
2. **Worker** — durable asynchronous work: notifications, search/media indexing, webhook follow-up, reconciliation, retries, and scheduled operational checks.
3. **Managed data/services** — PostgreSQL, object storage, and provider adapters behind application-owned ports.

The architecture is a modular monolith, not a microservice fleet. Domain modules communicate through in-process application services and durable outbox/job records where asynchronous reliability is required.

## 2. Major subsystems

| Subsystem | Responsibility | Owns | External boundary |
|---|---|---|---|
| Public web | Render Home, Shop, Education, content, branch, help, cart, checkout, tracking entry | Route rendering, response cache policy, public view models | Browser, crawler, CDN/cache |
| Catalog | Product/category/tag/attribute/media discovery | Product read model and catalog lifecycle | Media storage, search indexing |
| Inventory | Availability, reservations, adjustments, audit | Stock/availability decisions | Warehouse/operations data later |
| Cart and checkout | Customer purchase intent and validated checkout orchestration | Cart, checkout session, validation context | Payment/shipping ports |
| Order | Order lifecycle and immutable purchase snapshot | Orders, items, state transitions, audit/outbox | Payment/shipping/notification services |
| Payment | Provider-neutral payment attempts, events, refunds, reconciliation | Payment state mapping and provider adapter boundary | Payment provider UNKNOWN |
| Shipping | Provider-neutral rates, shipments, labels, AWB, tracking | Shipment/tracking state and provider adapter boundary | Shipping provider UNKNOWN |
| Customer/account | Guest/account ownership, addresses, order access | Customer profile/session authorization context | Authentication mechanism/provider deferred |
| Content and SEO | Articles/pages/taxonomy/media, metadata, redirects, sitemap, canonical decisions | Published content and SEO metadata | Crawler/Search Console later |
| Search | Public product/content discovery read model | Search queries, indexing triggers, relevance configuration | PostgreSQL search initially; external search optional |
| Notifications | Event-to-message orchestration, templates, delivery audit | Transactional notification records | Email/WhatsApp/SMS providers unknown |
| Admin | Staff operational commands/read models | Catalog, order, fulfillment, content/SEO workflows | Staff authorization and audit boundary |
| Analytics/observability | First-party domain events, metrics, audit, error/health signals | Event envelope and health read models | External analytics/monitoring optional |
| Media | Upload validation, object references, variants, rights metadata | Media lifecycle and content/product links | Object storage/CDN provider unknown |

## 3. High-level architecture diagram

```mermaid
flowchart LR
  Browser[Public customer or staff browser] --> Edge[CDN / edge cache]
  Crawler[Search crawler] --> Edge
  Edge --> Web[Next.js web application]
  Web --> App[Application services]
  App --> DB[(PostgreSQL)]
  App --> Store[Object storage port]
  App --> Search[Search port]
  App --> PayPort[Payment provider port]
  App --> ShipPort[Shipping provider port]
  App --> NotifyPort[Notification channel port]
  App --> AnalyticsPort[Analytics adapter port]
  Web --> Webhook[Webhook ingress]
  Webhook --> App
  DB --> Worker[Durable worker]
  Worker --> App
  Worker --> Store
  Worker --> Search
  Worker --> PayPort
  Worker --> ShipPort
  Worker --> NotifyPort
  Worker --> AnalyticsPort
  PayPort --> PaymentProvider[Payment provider - UNKNOWN]
  ShipPort --> ShippingProvider[Shipping provider - UNKNOWN]
  NotifyPort --> Channels[Email / WhatsApp / SMS - provider decisions]
```

## 4. Request and data flow

### Public/catalog request

```text
Browser or crawler
→ edge/cache decision
→ server-rendered route
→ catalog/content/SEO read service
→ PostgreSQL read model and media URLs
→ canonical HTML, metadata, structured data, response
```

Indexable routes render from server-owned data. Client-side enhancement must not be the only source of core product/content/SEO information.

### Commerce request

```text
Customer action
→ authenticated or guest context
→ request validation and idempotency boundary
→ application service transaction
→ order/cart/inventory updates
→ outbox record
→ response with truthful state
→ worker processes non-blocking follow-up
```

Provider calls that affect payment/shipping use explicit state transitions and durable records; the browser is never the authority for payment success.

## 5. Commerce flow

```mermaid
flowchart TD
  Discover[Shop / Search / Content / SEO landing] --> Product[Product detail]
  Product --> Cart[Cart]
  Cart --> Checkout[Checkout validation]
  Checkout --> Inventory{Inventory eligible?}
  Inventory -- no --> CartRecovery[Cart recovery / support]
  Inventory -- yes --> Rate[Shipping rate port]
  Rate --> PaymentStart[Create order and payment attempt]
  PaymentStart --> Pending[Pending payment]
  Pending --> PaymentEvent[Verified provider event]
  PaymentEvent --> Paid[Paid order]
  Paid --> Fulfillment[Staff fulfillment]
  Fulfillment --> Shipment[Shipment / AWB / label]
  Shipment --> Tracking[Tracking]
  Tracking --> Delivered[Delivered or exception]
  CartRecovery --> Product
```

## 6. Checkout and payment flow

```mermaid
sequenceDiagram
  participant C as Customer
  participant W as Web application
  participant O as Order service
  participant I as Inventory service
  participant P as Payment port
  participant X as Payment provider
  participant K as Worker

  C->>W: Submit validated checkout intent
  W->>O: Create/reuse idempotent order request
  O->>I: Validate availability/reservation policy
  I-->>O: Eligible or unavailable
  O->>P: Initiate payment attempt
  P->>X: Provider-specific adapter call
  X-->>P: Pending payment response
  P-->>O: Payment attempt reference/status
  O-->>W: Pending order outcome
  X->>W: Signed webhook/event
  W->>O: Verify and enqueue payment event
  O->>O: Idempotent state transition
  O->>K: Outbox notification/fulfillment work
  K-->>C: Transactional notification through approved channel
```

The exact reservation timing, payment method, provider response, expiration, refund, and settlement behavior remain client/provider decisions.

## 7. Shipping and fulfillment flow

```mermaid
sequenceDiagram
  participant Staff as Authorized staff
  participant A as Admin application
  participant O as Order service
  participant S as Shipping port
  participant X as Shipping provider
  participant W as Worker
  participant C as Customer

  Staff->>A: Open eligible order
  A->>O: Validate fulfillment state
  O-->>A: Package / destination / selected service context
  A->>S: Request rates or create shipment
  S->>X: Provider adapter call
  X-->>S: Rate / shipment / AWB / label / tracking response
  S-->>O: Persist shipment state and audit
  O->>W: Queue notification/tracking work
  W-->>C: Approved shipment/tracking notification
  X->>A: Signed tracking update webhook or scheduled refresh result
  A->>O: Idempotent tracking state update
```

Manual shipment/AWB/label fallback exists conceptually but must be authorized and audited. It is not a substitute for a provider decision.

## 8. Content and SEO flow

```mermaid
flowchart LR
  Editor[Authorized content/product staff] --> Admin[Admin content/SEO workspace]
  Admin --> Validate[Content, media, route and SEO validation]
  Validate --> DB[(PostgreSQL)]
  DB --> Render[Server-rendered public route]
  Render --> Meta[Metadata / canonical / structured data / OG]
  Render --> Sitemap[Sitemap candidate]
  Admin --> Redirect[Redirect registry]
  Redirect --> Render
  Worker[Worker] --> SearchIndex[Search indexing/read model]
  DB --> Worker
```

A published route change must be evaluated against the legacy URL mapping before it becomes public. Redirects, canonicals, and indexability are separate controls.

## 9. Admin operations flow

```mermaid
flowchart TD
  Staff[Authorized staff] --> Auth[Session and capability check]
  Auth --> AdminRoute[Admin task route]
  AdminRoute --> Service[Application service]
  Service --> Policy[State/permission/validation policy]
  Policy --> DB[(PostgreSQL transaction)]
  DB --> Audit[Audit log]
  DB --> Outbox[Outbox/job record]
  Outbox --> Worker[Worker]
  Worker --> Provider[Provider adapter or notification]
  Worker --> Alert[Operational alert / dashboard health]
```

## 10. Authentication and authorization flow

- Browser requests resolve a session context on the server.
- Customer/private account routes require customer ownership checks.
- Staff/admin routes require a staff identity plus proposed role/capability permissions.
- Application services enforce authorization; route visibility alone is never authorization.
- Sensitive commands create audit entries and can require a future approval policy.
- Account/auth provider, password/recovery implementation, customer migration, and final staff role assignments remain unresolved.

## 11. Asynchronous processing and reliability

The web request persists business state and an outbox/job intent in the same database transaction where required. The worker processes jobs with retries, idempotency keys, attempt history, and dead-letter/manual-review state. This avoids relying on a browser request or a best-effort external call for payment events, shipment updates, notifications, indexing, or media processing.

A separate broker is deliberately deferred. A database-backed durable queue is the proposed MVP choice; throughput/reliability must be validated before production.

## 12. System-wide boundaries

| Boundary | Reason |
|---|---|
| Server-rendered public routes vs client enhancement | Protect SEO, performance, and accessibility while retaining interactive commerce behavior. |
| Application service vs route handler/server action | Keep business rules reusable, testable, and independent of HTTP/UI delivery. |
| Domain module vs repository/data access | Keep transaction rules and data persistence separate. |
| Provider port vs adapter | Prevent payment/shipping/notification/search/storage vendor coupling. |
| Request transaction vs worker job | Keep customer response truthful and fast while making retries/reconciliation durable. |
| Public/account/admin route spaces | Prevent private operational/customer state from entering crawlable public surfaces. |
| Authoritative commerce records vs analytics | Analytics observes events; order/payment/shipment records remain authoritative. |

## 13. Confirmed constraints and open blockers

**Confirmed:** single-vendor model; SEO-first public rendering; relational commerce needs; provider-agnostic payment/shipping; migration-sensitive URLs/content/media; complete commerce loop.

**Blocked/unknown:** catalog completeness, inventory rules, source SEO data, payment provider/methods, shipping provider/origin/rates, legal/privacy policy, account migration, historical orders, branch/event/media data, operational SOPs, hosting/provider selection.

Architecture can define ports and flows now, but provider-specific integration and migration execution remain blocked.
