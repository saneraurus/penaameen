# PENA AMEEN Database Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED conceptual relational data architecture. This is not SQL, an ORM schema, a migration, table definition, index script, or database implementation.

## 1. Data architecture principles

- PostgreSQL is the proposed authoritative relational store for transactional and operational data.
- Each entity has one ownership boundary and explicit lifecycle/state rules.
- Purchase snapshots and audit records preserve historical truth even when catalog/content changes later.
- Payment/shipping provider data is normalized behind provider-neutral records while retaining safe external references for reconciliation.
- Media objects live in object storage; the database stores metadata, rights, references, and lifecycle state.
- Analytics observes privacy-safe events; it is not the source of truth for orders, payments, stock, or shipping.
- Migration source identity and legacy URL mapping are retained where needed for reconciliation, not discarded.

## 2. Entity architecture

| Entity | Purpose and ownership | Key relationships | Lifecycle | Sensitive data | Migration considerations |
|---|---|---|---|---|---|
| Product | PENA AMEEN-managed sellable catalog record; Catalog owns | Category/tag/attribute/media/variant/inventory/order item/SEO | Draft → active → archived/retired | Commercial data; no special PII | Preserve source ID, slug, SKU, price, descriptions, status, images, SEO; catalog incomplete |
| ProductVariant | Purchasable option under Product when source confirms variants; Catalog owns | Product, inventory, media, order item | Active/retired with parent | SKU/commercial data | UNKNOWN whether variants exist; do not fabricate migration rows |
| Category | Stable product browse taxonomy; Catalog/SEO owns | Products, category SEO, legacy route | Draft/review/published/archived conceptually | None | Preserve/match source category IDs/slugs/URLs; taxonomy decisions pending |
| Tag | Sparse product/content descriptor; Catalog or Content owns by type | Products or articles, SEO archive policy | Active/merged/redirected/retired | None | Existing tag inventory incomplete; retain source identity/treatment decision |
| ProductImage | Product-media relationship/order/role; Catalog/Media owns | Product/variant, Media | Attached/removed; product publishing validates required media | Rights/metadata may be sensitive operationally | Map source media ID/file/alt/order/role; rights unknown |
| Inventory | Current stock position for a SKU/product at a location; Inventory owns | Product/variant, InventoryLocation, adjustments/reservations/order item | Available/reserved/adjusted/reconciled | Operational quantities | Stock/source rules UNKNOWN; initial reconciliation required |
| InventoryLocation | Logical stock-holding location; Inventory owns | Inventory records, fulfillment allocation | Active/inactive | Location/address may be sensitive | Start with one confirmed/default location only when supplied; architecture supports later multiple locations |
| InventoryAdjustment | Immutable stock change/audit record; Inventory owns | Inventory, actor, source order/return/reason | Append-only/reversed by compensating adjustment | Staff identity/reason may be sensitive | Historical stock adjustment migration not assumed |
| InventoryReservation | Time-bounded/approved inventory hold; Inventory/Order owns | Cart/order/item, inventory | Created → confirmed/released/expired | None | Reservation policy/expiry UNKNOWN; preserve conceptual separation |
| Cart | Guest or customer purchase intent; Cart owns | CartItem, customer/session context | Active/abandoned/converted/expired per policy | Session/customer linkage | Existing cart migration not required; persistence policy unknown |
| CartItem | Requested product/variant/quantity snapshot | Cart, product/variant | Added/updated/removed/converted | None | Validate against current catalog; no source cart migration assumed |
| Customer | Customer identity/profile record; Customer owns | Address, order, session/account, notification preference | Guest association/account active/archived/deleted per policy | PII: name, email, phone, consent | Customer migration requires decision/legal review |
| Address | Customer/order delivery/billing address record; Customer/Order owns | Customer, order snapshot, shipping quote | Active/archived/snapshotted | PII: full address/recipient/phone | Source customer/address migration conditional |
| Order | Immutable commercial purchase record; Order owns | OrderItem, customer snapshot, payment, shipment, audit, notification | State machine in Order Architecture | PII/commercial totals | Historical migration requires decision and financial reconciliation |
| OrderItem | Purchase-time product/variant/name/price/quantity snapshot; Order owns | Order, product/variant source reference | Immutable except approved corrective records | Commercial data | Preserve historic name/price even if catalog changes |
| Payment | Provider-neutral payment aggregate for an order; Payment owns | Order, PaymentAttempt, refund/reconciliation | Not started/pending/paid/failed/etc. | External transaction reference; financial data | Provider/method/history migration unknown |
| PaymentAttempt | One initiation/attempt/event context; Payment owns | Payment, order, idempotency, provider event | Created/pending/succeeded/failed/expired/cancelled | Provider references; no raw credentials | Current provider mapping unknown |
| PaymentEventReceipt | Verified or quarantined provider event receipt; Payment owns | PaymentAttempt, audit/outbox | Received/processed/quarantined | Signed payload must be minimized/protected | No source import assumed; needed after target launch |
| Refund | Approved refund request/outcome; Payment/Order owns | Payment, order, actor/audit | Requested/processing/completed/failed | Financial references | Policy/partial refund/settlement unknown |
| Shipment | Provider-neutral fulfillment shipment; Shipping owns | Order, ShipmentItem, TrackingEvent, label/media reference | Requested/created/AWB/label/dispatched/etc. | Recipient/destination data | Historical shipment migration conditional |
| ShipmentItem | Order item allocation/quantity in a shipment; Shipping owns | Shipment, order item | Allocated/cancelled/returned | None | Required if partial/multiple shipments arise; source behavior unknown |
| TrackingEvent | Normalized carrier/provider tracking history; Shipping owns | Shipment | Received/normalized/superseded if corrected | External tracking details | Provider mapping/history unknown |
| ShippingQuote | Rate request/options/selection record; Shipping/Checkout owns | Cart/order, address, package, shipment | Requested/available/expired/selected/failed | Address/service/cost data | No historical quote migration required |
| Coupon/Discount | Approved promotion terms/application; Catalog/Order owns | Product/category/cart/order | Draft/active/expired/revoked | Commercial rules | CLIENT DECISION REQUIRED; no model implementation assumed |
| Article | Editorial content record; Content owns | ArticleCategory, Tag, Media, SEO, related links | Draft/review/published/archived | Author/rights metadata | Preserve source ID/slug/body/date/author/media/categories/links |
| ArticleCategory | Stable content taxonomy; Content/SEO owns | Articles, archive SEO | Active/merged/redirected/retired | None | Source archive/category data incomplete; per-category mapping needed |
| Page | Durable standalone content such as Profile/FAQ/legal; Content owns | Media, SEO, redirects | Draft/published/archived | Legal content may be sensitive operationally | Preserve/map source page URL/body/metadata where applicable |
| Media | Metadata/reference to an object-storage asset; Media owns | ProductImage, Article/Page/Branch/Event, SEO | Uploaded/processing/approved/archived/removed | Rights/license/source, possibly personal images | Media export, ownership, alt/caption unknown |
| Branch | Approved local/community record; Content/Operations owns | Media, SEO, Events/contact | Draft/active/inactive/archived | Address/contact may be PII/business-sensitive | Two source branches known; full data/active status unknown |
| Event | Approved event/recap record; Content owns | Branch, Media, SEO | Draft/upcoming/completed/archived | Location/contact/registration information | Event inventory/retention unknown |
| Testimonial | Approved trust statement; Content/Legal owns | Media, product/program/page | Draft/approved/retired | Person identity/consent | Permission/source unknown; migration only if approved |
| SEO Metadata | URL/entity-specific title/description/canonical/indexability/OG/schema input; SEO owns | Product/category/article/page/branch/event | Draft/validated/published/superseded | None normally | Source metadata/schema unknown; preserve source fields where available |
| Redirect | Legacy URL to target/treatment record; SEO owns | Source URL, target route/entity, audit | Draft/approved/tested/active/retired | None | Critical full source inventory/decision matrix required |
| Notification | Transactional notification intent/delivery audit; Notification owns | Order/payment/shipment/customer/template | Queued/sent/delivered/failed/suppressed | Contact destination/message content | Existing channels/consent/provider unknown |
| NotificationPreference | Approved channel/preference/consent record; Customer/Notification owns | Customer, notification | Active/revoked/expired per policy | PII/consent | Legal policy and migration unknown |
| AdminUser | Staff identity/projection; Authorization owns | Role, permission, audit | Active/suspended/deactivated | Staff PII/auth data | Existing staff migration unknown |
| Role | Proposed staff capability bundle; Authorization owns | Permission, AdminUser | Draft/active/deprecated | None | Final roles require client decision |
| Permission | Atomic action/resource capability; Authorization owns | Role, policy/audit | Active/deprecated | None | Must map approved staff boundaries, not source UI assumptions |
| AuditLog | Immutable sensitive action/state record; Audit owns | Actor, target entity, correlation/event | Append-only | PII/operational context, access controlled | Historical audit migration not assumed |
| OutboxEvent / Job | Durable asynchronous work intent and execution state; Platform owns | Domain entity, audit, worker | Pending/processing/succeeded/failed/manual review | Minimal safe payload only | New target operational data; no source migration |
| IdempotencyRecord | Deduplication record for command/event boundaries; Platform owns | Request/payment/shipment/notification action | Active/expired by policy | Request correlation; avoid PII payload | New target operational data |

## 3. Core relationship map

```text
Product ──< ProductVariant
Product ──< ProductImage >── Media
Product >──< Category / Tag / Attribute
ProductVariant or Product ──< Inventory >── InventoryLocation

Cart ──< CartItem >── Product or ProductVariant
Customer ──< Address
Customer ──< Order ──< OrderItem
Order ──< Payment ──< PaymentAttempt / Refund
Order ──< Shipment ──< ShipmentItem / TrackingEvent
Order ──< Notification

Article >──< ArticleCategory / Tag
Article / Page / Branch / Event ──< Media
Product / Category / Article / Page / Branch / Event ──< SEO Metadata
Legacy URL ──< Redirect ──> Target route/entity
AdminUser >──< Role >──< Permission
All sensitive command paths ──< AuditLog
Domain state transitions ──< OutboxEvent / Job
```

## 4. Data lifecycle and retention boundary

- Lifecycle states must be explicit, reversible where business rules permit, and audited for sensitive actions.
- Published/active public entities have canonical/SEO state separate from operational draft/archive state.
- Order item, customer/address, price, tax/discount, payment, shipment, and tracking snapshots preserve the historical transaction context.
- Personal data minimization, retention, deletion/export, consent, legal hold, and historical migration policy are not confirmed; they require legal/client decisions before implementation.
- Provider payload retention must be minimized and access-controlled; raw payment credentials must never be stored in application entities.

## 5. Data ownership and cross-module rules

- Catalog may change a future product, but not a historical order item snapshot.
- Inventory owns availability/reservation; Cart may request it but cannot mutate stock directly.
- Order owns order workflow; Payment and Shipping own their separate aggregates/events and report authorized transitions to Order.
- Content owns editorial publication; SEO owns route/meta/redirect policy; neither can silently retire a source URL without a redirect/content decision.
- Authorization owns role/permission semantics; Admin UI route access cannot substitute an authorization check.
- Analytics consumes privacy-safe events; it cannot change domain state.

## 6. Migration architecture considerations

- Every migratable entity needs source identity, source URL/slug when applicable, mapping status, validation status, and documented exclusions.
- Product, article, category/tag, media, branch, SEO metadata, redirect, customer, order, payment, and shipment migration each require distinct reconciliation criteria.
- Customer, order, payment, shipment, refund, address, consent, and account migration remain client/legal/finance decisions.
- No production data model can be finalized until the source exports and Phase 4 data architecture validate cardinality, identifiers, data quality, retention, and mappings.

## 7. Explicit non-schema boundary

This document intentionally does not define table names, columns, data types, indexes, foreign keys, migrations, ORM models, SQL, seed data, or database connection settings. Those are Phase 4 and later implementation-constitution outputs.
