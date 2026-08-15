# PENA AMEEN Data Domain Map

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical data blueprint. It defines domain boundaries and data ownership without creating a physical schema, database, migration, ORM model, or implementation.

## 1. Data architecture objective

The data blueprint supports PENA AMEEN’s single-vendor commerce loop:

```text
Discovery → Product → Cart → Checkout → Payment → Order → Shipping → Tracking
```

It preserves historical commerce truth, migration provenance, SEO route safety, provider-neutral integration boundaries, privacy-sensitive customer data, and staff operational accountability. Unknown source data and unresolved business policy remain explicit rather than being converted into defaults.

## 2. Domain map

| Domain | Purpose | Logical owner | Source of truth | Primary entities | Major relationships | Lifecycle focus | External dependencies | Migration sensitivity | Unresolved decisions |
|---|---|---|---|---|---|---|---|---|---|
| A. Catalog | Define PENA AMEEN sellable products and commercial presentation | Catalog module | Target catalog records after approved migration; source WooCommerce export until then | Product, ProductVariant, ProductPackage, SKU, ProductImage, ProductDocument, ProductAttribute, ProductAttributeValue, ProductRelation | Taxonomy, Inventory, Media, SEO, OrderItem | Draft, active, archived/retired | Media storage, Search | Critical: product IDs, slugs, SKU, price, media, packages | Active catalog, SKU strategy, variants/packages, price/sale policy |
| B. Taxonomy | Provide stable product/content browse classification | Catalog and Content/SEO modules by scope | Scoped target taxonomy; source categories/tags during migration | Category, Tag, CategoryProduct, TagProduct, Collection conditional | Product, Article, SEO, Search | Draft/review/published/merged/retired | Search, SEO | Critical/High: indexed category/tag archives | `Umum`, tags, ACM category, archive retention, collections |
| C. Inventory | Track sellable stock, reservations, allocations, adjustments | Inventory module | Target inventory ledger/position; source warehouse/WooCommerce data pending | InventoryItem, InventoryLocation, InventoryMovement, StockReservation | SKU/sellable unit, OrderItem, ShipmentItem | Available, reserved, committed, released, adjusted | Warehouse/operations source | Critical: stock/SKU/reconciliation | Locations, reservation timing, backorder, packages, branches |
| D. Customer | Represent customer/guest identity, addresses, consent, sessions | Customer/Identity module | Target customer records; source customer export only if approved | Customer, CustomerAddress, CustomerSession, CustomerConsent | Cart, Order, NotificationPreference | Guest association, account active, archived/deleted by policy | Authentication, Notification | High: PII/consent/legal | Guest policy, customer migration, retention/deletion, identity mechanism |
| E. Cart | Hold current purchase intent before order commitment | Cart module | Target cart/session records | Cart, CartItem | Customer/guest session, SKU/sellable unit, Checkout | Active, abandoned, converted, expired by policy | Inventory, Catalog | Low for source migration; critical for runtime correctness | Persistence, expiry, reservation behavior |
| F. Order | Preserve historical commercial agreement and workflow state | Order module | Target Order/OrderItem snapshots | Order, OrderItem, OrderAddress, OrderStatusHistory, OrderNote | Customer, Payment, Shipment, Inventory, Notification, Audit | Draft/pending/paid/processing/fulfilled/cancelled/refund policy | Payment, Shipping, Notification | Critical: historic order mapping/financial accuracy | Historical order migration, tax/discount, cancellation/return rules |
| G. Payment | Model provider-neutral payment attempts/events/refunds/reconciliation | Payment module | Target Payment records plus verified provider evidence | Payment, PaymentAttempt, PaymentEvent, Refund, SettlementRecord | Order, Notification, Audit, Idempotency | Initiated/pending/paid/failed/expired/refund states | Payment provider UNKNOWN | Critical: status/reference/history mapping | Provider, methods, currency, settlement, refunds, event evidence |
| H. Shipping | Model rates, shipment, AWB, labels, tracking, exceptions, returns | Shipping module | Target Shipment/Tracking records plus verified provider evidence | ShippingRate, Shipment, ShipmentItem, TrackingEvent, ShippingLabel, DeliveryException, ReturnRequest | Order, OrderItem, Address, Inventory, Notification | Quote through delivered/exception/return states | Shipping provider UNKNOWN | Critical: provider/source shipment history | Origin, couriers, package rules, return policy, labels/tracking |
| I. Content | Manage articles, pages, testimonials, galleries, events | Content/CMS module | Target published content; WordPress export during migration | Article, ArticleCategory, ArticleTag, Page, Event, Testimonial, Gallery | Taxonomy, Education, Media, SEO, Search | Draft/review/published/archived | Media, Search | Critical/High: article/page URL and body/media preservation | Complete export, content owner, author policy, event/gallery/testimonials |
| J. Education | Connect AL-BARQY/ACM content, products, and resources without duplicate taxonomy | Education module/content ownership | Target EducationHub relationships; source content/category evidence | EducationHub, EducationResource, EducationRelation | Article, Product, Page, Media, SEO | Draft/published/retired relation states | Catalog, Content | High: AL-BARQY/ACM hub/archive mapping | Hub/canonical/category relationship, ACM product family/category |
| K. Branch | Represent active local/community branch information | Operations/Content module | Approved branch directory; source pages partial | Branch, BranchContact, BranchLocation | Event, Media, SEO, Contact | Draft/active/inactive/archived | Maps/contact source | High local SEO | Active list, addresses, branch inventory, partner role |
| L. Media | Manage reusable asset metadata, rights, variants, usage | Media module | Target MediaAsset metadata + object storage; source WordPress media export | MediaAsset, MediaVariant, MediaUsage | Product, Content, Branch, Event, SEO | Pending/validated/approved/attached/archived | Object storage/CDN | Critical: source file/rights/alt/reference mapping | Rights, ownership, access, transforms, retention |
| M. SEO | Control metadata, canonical references, redirects, sitemap candidates | SEO module | Approved target SEO records; source crawl/plugin export pending | SeoMetadata, Redirect, SitemapEntry, CanonicalReference | All public content/catalog routes | Draft/validated/published/retired | Search Console, crawler | Critical: legacy URL/metadata/redirects | Source metadata, archive treatment, redirect approval, ownership |
| N. Search | Derive eligible public search documents and query configuration | Search module | Derived target search documents from published data | SearchDocument, SearchSynonym, SearchRedirect | Catalog, Content, Education, Branch, SEO | Indexed/stale/removed | PostgreSQL search initially; external engine deferred | High: source taxonomy/URL/publication mapping | Language, synonyms, typo tolerance, provider threshold |
| O. Notification | Record transactional intent, template, delivery, preference | Notification module | Target notification/audit records | Notification, NotificationTemplate, NotificationDelivery, NotificationPreference | Customer, Order, Payment, Shipment | Queued/sent/delivered/failed/suppressed | Channel providers UNKNOWN | Medium: customer contact/consent history | Channel, sender, template, consent, retention |
| P. Admin / Authorization | Model staff capabilities and secure operations | Identity/Access module | Target staff role/permission records | StaffUser, Role, Permission, StaffUserRole, RolePermission, AuditLog | All protected domains | Active/suspended/deprecated role lifecycle | Authentication provider UNKNOWN | High: staff data/audit/operations | Final roles, authority, MFA/SSO, audit access/retention |
| Q. Analytics | Capture privacy-safe product and operational event observations | Analytics module | Target first-party event records; external analytics optional | AnalyticsEvent, ConversionEvent | Public routes, commerce lifecycle, SEO | Received/validated/aggregated/expired by policy | Analytics/Search Console UNKNOWN | Medium: event continuity/consent | Provider, consent, retention, KPI ownership |
| R. Audit / System | Support idempotency, durable outbox/job work, settings, traceability | Platform module | Target system records | IdempotencyKey, OutboxEvent, Job, JobAttempt, SystemSetting | All command/event domains | Pending/processing/succeeded/failed/manual review | Worker, monitoring, deployment | High: migration/reconciliation and reliability | Retry/retention/setting ownership, job infrastructure |

## 3. Domain ownership rules

- Each domain has one logical write authority even if multiple modules consume its data.
- Catalog cannot rewrite historical OrderItem snapshots.
- Inventory alone decides available/reserved/committed stock state.
- Payment and Shipping own their provider-neutral aggregates; Order owns the order workflow summary and authorized cross-domain transitions.
- SEO owns canonical/indexability/redirect policy; Content/Catalog owns publication source data.
- Analytics observes events; it does not update authoritative commerce state.
- Media owns asset lifecycle and rights metadata; other domains own their usage relationship.
- Admin is an operational surface, not an alternate source of truth.

## 4. Cross-domain data flow

```text
Catalog + Taxonomy + Media + SEO → Search/Public routes
Catalog + Inventory → Cart → Checkout → Order
Order → Payment / Shipping / Notification / Audit
Order + Inventory → Fulfillment allocation
Content + Education + Media + SEO → Public education/content routes
Branch + Media + SEO → Local/community routes
All committed domain events → Outbox/Jobs → Notification/Search/Analytics/Observability
```

## 5. Critical data architecture blockers

The domain map is complete as a blueprint, but implementation data readiness remains blocked by incomplete catalog/source IDs, SKU/inventory/package rules, customer/order migration decisions, payment/shipping providers, tax/discount/return policy, content/media exports and rights, full SEO inventory, privacy/retention policy, staff authorities, and platform ownership.
