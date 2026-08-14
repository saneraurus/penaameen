# PENA AMEEN Domain Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory domain boundary rules. Domain names, ownership, entities, and events follow Phase 3/4 architecture; this document does not create code or physical data models.

| Domain | Ownership / responsibilities | Allowed dependencies | Forbidden dependencies | Events / external boundary |
|---|---|---|---|---|
| Catalog | Current Product, SKU, variant/package, taxonomy membership, publication/commercial data | Taxonomy, Media, SEO, Inventory read contract, Search outbox | Order snapshot mutation, provider SDK, UI policy | CatalogPublished/Changed/Retired; source import only through migration contract |
| Taxonomy | Scoped Category/Tag/relations/archive semantics | Catalog or Content by scope, SEO | UI-generated taxonomy, duplicate archive/provider logic | TaxonomyChanged/Merged; SEO route validation |
| Inventory | On-hand/reserved/allocated/movement/reconciliation | Catalog sellable identity, Order/Fulfillment contracts | Cart/UI direct mutation, provider SDK, raw warehouse assumption | StockReserved/Released/Adjusted; warehouse adapter only when approved |
| Customer | Customer, address, session, consent/preference, ownership | Authorization, Order, Notification | Public search/analytics PII leak, UI-only auth | ConsentChanged/CustomerUpdated; identity adapter boundary |
| Cart | Current guest/customer intent and line validation | Catalog, Inventory availability, Customer session | Payment/shipping/provider state authority | CartChanged/Converted; no source-cart migration assumption |
| Order | Historical order/item/address snapshots and workflow | Customer, Inventory, Payment/Shipping normalized contracts, Notification/Audit | Mutable catalog data as historical truth, provider SDK | OrderCreated/StateChanged/Cancelled; outbox required |
| Payment | Provider-neutral payment/attempt/event/refund/settlement | Order, Audit, Notification, Payment port | UI/browser status authority, direct Order mutation outside service | PaymentVerified/Failed/Review; Payment provider port |
| Shipping | Quote/shipment/AWB/label/tracking/exception/return model | Order, Inventory allocation, Customer address snapshot, Notification | Direct provider model in core, tax/payment authority | ShipmentCreated/TrackingChanged; Shipping provider port |
| Content | Article/Page/Event/Gallery/Testimonial publication | Taxonomy, Media, SEO, Education, Search | Provider/UI ownership, unapproved claim creation | ContentPublished/Archived; source import contract |
| Education | Hub/resource/relation between approved content/products | Content, Catalog read contracts, SEO, Media | New taxonomy/provider assumptions | EducationRelationChanged; client approval for AL-BARQY/ACM relationship |
| Branch | Active branch/contact/location/local content | Content, Media, SEO | Inventory/shipping relation without approval | BranchActivated/Changed; client branch source boundary |
| Media | Asset/variant/usage/rights lifecycle | Catalog/Content/Branch/Event target contracts, Storage port | Raw binary as domain truth, unapproved public delivery | MediaApproved/Attached/Removed; object-storage port |
| SEO | Metadata/canonical/redirect/sitemap/indexability | Content/Catalog/Branch/Education routes, Media | UI-only route changes, source URL discard | RedirectChanged/SitemapInvalidated; crawl/Search Console boundary |
| Search | Derived public SearchDocument/query rules | Catalog/Content/Education/Branch/SEO published data | Core commerce state authority, unbounded provider leak | SearchDocumentChanged; PostgreSQL-first search port |
| Notification | Intent/template/delivery/preference lifecycle | Customer consent, Order/Payment/Shipping events, Audit | Domain state authority, direct provider in core | NotificationQueued/Delivered/Failed; channel ports |
| Admin | Authorized operational read/command composition | Application services, Authorization, Audit | Bypass domain/state/ownership rules | AdminCommandRecorded; no separate data source |
| Analytics | Privacy-safe observational/aggregate events | Approved domain events, consent, SEO/route data | Transaction/state authority, raw PII default | AnalyticsEventCaptured; external adapter optional |
| Audit/System | Audit, idempotency, outbox, jobs, settings | All service boundaries through stable contracts | Business policy ownership, secret storage in data records | JobQueued/Attempted; worker/monitoring boundary |

## Dependency rules

- Cross-domain command orchestration belongs in application services, not in a domain importing another domain’s repository.
- Domains publish typed facts/events; consumers must tolerate repeat, delay, ordering, and failure through idempotency/reconciliation rules.
- External boundaries are ports implemented by adapters after approval. No core domain imports provider SDK types/statuses.
- A domain may read a narrow approved contract from another domain; it may not write that domain’s source of truth directly.
