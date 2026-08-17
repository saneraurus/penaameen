# PENA AMEEN Data Ownership Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical ownership model. Ownership means which application subsystem is allowed to make authoritative writes. It does not define database permissions, staff roles, physical services, or provider credentials.

## 1. Ownership principles

- One logical domain has one authoritative write owner.
- Other modules consume read models, snapshots, events, or approved service contracts; they do not write another domain’s records directly.
- External systems provide evidence/synchronization through provider adapters; they do not become the source of truth for target domain policy.
- Historical snapshots, audit logs, outbox records, and migration provenance prevent mutable data from rewriting history.
- Human staff authority is enforced through future authorization policy; domain ownership does not grant every staff member access.

## 2. Domain ownership matrix

| Domain | System of record | Write authority | Read consumers | External synchronization | Audit requirement |
|---|---|---|---|---|---|
| Catalog | Product, SKU, package, attribute, relation target records | Catalog service through authorized catalog workflows | Shop, Search, Cart, Order, Content/Education, Admin, SEO | Source WooCommerce import; media/search publish events | Product identity, price/status, package, category/media/SEO changes |
| Taxonomy | Scoped Category/Tag and associations | Catalog or Content service by taxonomy scope; SEO validates public route effects | Shop, Content, Education, Search, Admin, SEO | Source WordPress/WooCommerce taxonomy import | Public archive, slug, merge, indexability changes |
| Inventory | InventoryItem, movement, reservation, allocation | Inventory service only | Cart, Checkout, Order, Fulfillment, Admin | Warehouse/operations import/reconciliation only after approval | Every movement/reservation/adjustment/reconciliation |
| Customer | Customer, address, session, consent | Customer/Identity service; customer self-service only under policy | Cart, Checkout, Order, Notification, Support/Admin | Customer export only if migration approved | PII change/access, consent, session/security action |
| Cart | Cart and CartItem | Cart service | Checkout, public cart, customer account | None required from source | Optional safe mutation/correlation history |
| Order | Order, snapshot, state history, notes | Order service through allowed state transitions | Payment, Shipping, Customer, Admin, Notification, Analytics | Historical order import only if approved | Status, note, cancel, correction, support action |
| Payment | Payment, attempt, event, refund, settlement | Payment service; verified adapter events; authorized finance action | Order, Admin, Notification, Analytics | Payment provider event/reconciliation adapter; historical import conditional | Payment event, reconciliation, refund, manual review |
| Shipping | Rate, shipment, label, tracking, exception, return data | Shipping service; verified adapter events; authorized fulfillment action | Checkout, Order, Tracking, Admin, Notification | Shipping provider adapter; historical import conditional | Quote, shipment, AWB/label, tracking, cancellation/return action |
| Content | Article, page, event, testimonial, gallery | Content service through approved editorial workflow | Public routes, Education, Search, SEO, Admin | WordPress/content import | Publish/archive/claim/author/media change |
| Education | Hub/resource/relation | Education/content service through approved editorial relation policy | Public Education, Product, Article, Search, SEO | Source category/content relation import where valid | Hub route, relation, canonical/SEO effect |
| Branch | Branch/contact/location | Operations/content service through approved branch workflow | Public Branches, Search, SEO, Admin | Client branch directory/source pages | Active status, address/contact, route/local SEO change |
| Media | Asset/variant/usage/rights metadata | Media service plus authorized attaching domain | Catalog, Content, Branch, Event, SEO, Admin | WordPress media export/object-storage import | Upload, rights, approval, usage, removal/access |
| SEO | SeoMetadata, Redirect, SitemapEntry, CanonicalReference | SEO service through approved content/catalog/redirect workflow | Public renderer, Sitemap, Search, Admin, Analytics | Source SEO plugin/crawl/Search Console import | Canonical/indexability/redirect/sitemap publication |
| Search | SearchDocument, synonym, search redirect | Search service from approved published domain events | Public Search, Admin, Analytics | Optional external search adapter later | Index update, synonym/ranking config, stale/remove event |
| Notification | Intent, template, delivery, preference | Notification service from committed domain event; preference via Customer/Legal policy | Customer, Admin, Support, Analytics | Channel provider adapter | Event/template/channel/delivery/retry/suppression |
| Authorization | Staff identity projection, role, permission, assignment | Identity/Access service through approved access workflow | All protected services/Admin | Future auth/SSO adapter; staff migration unknown | Grant/revoke/access/security event |
| Analytics | First-party analytics/conversion records | Analytics service from approved events | Admin, Product, SEO, Operations | Optional external analytics adapter | Event schema/consent/export/aggregation change |
| Audit/System | AuditLog, idempotency, outbox, jobs, settings | Platform services; append-only audit paths | All modules, Worker, Observability, Admin | Monitoring/worker adapter only | Sensitive command, job/event, setting and retry history |

## 3. External-system ownership boundary

| External system class | May provide | Must not own |
|---|---|---|
| Current WordPress/WooCommerce source | Migration source IDs/content/catalog/media/URL evidence | Target commerce, SEO, inventory, customer, order, or lifecycle policy after cutover |
| Payment provider | Verified payment event/status/reference and settlement evidence | PENA AMEEN order, customer, inventory, refund policy, audit ownership |
| Shipping provider | Rate/shipment/AWB/label/tracking evidence | PENA AMEEN order, inventory, customer-support, return policy ownership |
| Object storage/CDN | Binary object delivery/storage state | Media rights, usage relationship, public publication decision |
| Auth provider | Identity assertion/session integration where approved | PENA AMEEN authorization/capability and customer/order ownership policy |
| Analytics provider | Optional aggregate event processing | Order/payment/shipping/inventory authority or raw PII source of truth |
| Search engine | Derived searchable documents/results | Published content/catalog/SEO authority |

## 4. Read/write conflict rules

- OrderItem, OrderAddress, payment event, shipment/tracking event, inventory movement, audit log, and migration mapping records are historical evidence; later catalog/customer/media edits cannot overwrite their snapshot fields.
- A Product may be referenced by a historic OrderItem but its current price/name/status remains owned by Catalog.
- A Payment provider event may update normalized Payment state only through Payment service validation; it cannot directly update Order, Inventory, or Notification records.
- A Shipment tracking event may update normalized Shipment state only through Shipping service validation; it cannot directly mark Order paid or refund stock.
- SEO metadata/redirect changes require SEO ownership even when initiated from Catalog or Content workflows.
- Analytics may read safe domain events but must not issue authoritative state transitions.

## 5. Ownership gaps requiring client input

The following cannot be finalized from discovery: staff write authority, refund approval, stock adjustment authority, branch/event ownership, editorial/SEO approval, source-data owner, legal data controller/retention owner, provider account owner, and platform configuration owner. They remain tracked in the client/data decision registers.
