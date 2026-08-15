# PENA AMEEN Data Relationships

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical relationship model. Cardinality describes target-domain intent, not physical foreign keys or a database schema. `UNKNOWN`, `PARTIAL`, and `CLIENT DECISION REQUIRED` relationships must not be implemented as confirmed facts.

**Major logical relationships documented:** **119**.

## 1. Cardinality conventions

- **1:1** means one active logical counterpart, often with optional historical/version records handled separately.
- **1:N** means one parent can have multiple child records; zero-child cases may be valid unless stated otherwise.
- **N:M** requires an explicit logical association record; this blueprint names known association entities where required.
- **Typed target** means a controlled target-type/reference relationship. Physical representation is deferred to Phase 4 implementation design.
- A relationship marked `UNKNOWN` is documented because it is architecturally relevant, not because its cardinality has been decided.

## Catalog and taxonomy

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| Product → ProductVariant | 1:N | ProductVariant references one parent Product | Represent purchasable options only when source confirms them | UNKNOWN: variant existence/cardinality |
| Product → ProductPackage | 1:N or 0:N | ProductPackage references parent sellable Product/Variant | Represent package composition/version | UNKNOWN: packages/components/configurability |
| ProductPackage → component Product/Variant | 1:N | Package component reference with quantity | Link package to included sellable components | UNKNOWN: component stock allocation |
| Product → ProductImage | 1:N | ProductImage association | Assign role/order media to product | PROPOSED; source image mapping incomplete |
| ProductVariant → ProductImage | 0:N | ProductImage association | Allow option-specific media when variants exist | UNKNOWN: variant/media source |
| Product → ProductDocument | 0:N | ProductDocument association | Associate approved documents/downloads | DEFERRED: source need unknown |
| ProductAttribute → ProductAttributeValue | 1:N | Value references one attribute | Define controlled values per attribute | PROPOSED |
| Product/Variant → ProductAttributeValue | N:M | Logical assignment association; physical join deferred | Describe/select product attributes without new taxonomy | UNKNOWN: source attributes/variants |
| Product → Category | N:M | CategoryProduct association | Support retained product browse taxonomy | PARTIAL: source memberships incomplete |
| Product → Tag | N:M | TagProduct association | Support sparse approved product tags | UNKNOWN: tag purpose/membership |
| Product → ProductRelation as source | 1:N | ProductRelation.sourceProduct | Curated related/cross-sell/upsell context | PARTIAL: relationships not exported |
| ProductRelation → Product as target | N:1 | ProductRelation.targetProduct | Point relation to a valid target product | PROPOSED |
| SKU → Product or ProductVariant | 1:1 to one sellable subject | Polymorphic sellable-subject reference | Give each sellable unit stable operational identity | CLIENT DECISION REQUIRED: SKU strategy |
| SKU → InventoryItem | 1:N | InventoryItem references SKU | Track stock across logical locations | PROPOSED; locations unknown |
| Product → SeoMetadata | 0:1 active | SEO metadata target reference | Define active product SEO state | PROPOSED; source metadata unknown |
| Category → SeoMetadata | 0:1 active | SEO metadata target reference | Define category archive SEO state | PROPOSED |
| Tag → SeoMetadata | 0:1 active | SEO metadata target reference | Support only approved public tag archive | CLIENT DECISION REQUIRED |
| Collection → Product | N:M | Conditional collection membership association | Curated merchandising only when approved | DEFERRED: no collection requirement |
| Category → Category parent | 0:1 parent / 0:N children | Optional self-reference | Allow hierarchy only if source/client establishes it | UNKNOWN: no hierarchy evidence |
| Tag → Tag parent | None proposed | No default self-hierarchy | Prevent unnecessary tag tree | PROPOSED no relation |

## Inventory and fulfillment allocation

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| InventoryItem → InventoryLocation | N:1 | Inventory item references one logical location | Locate stock position | UNKNOWN: single/multiple locations |
| InventoryItem → InventoryMovement | 1:N | Movement references one inventory item | Preserve append-only stock ledger | PROPOSED |
| InventoryItem → StockReservation | 1:N | Reservation references one inventory item | Calculate reserved/available stock | PROPOSED |
| StockReservation → CartItem | 0:1 | Reservation source may be a cart line | Represent approved cart hold only if policy exists | UNKNOWN: reservation timing |
| StockReservation → OrderItem | 0:1 | Reservation source may become an order line | Commit/release stock through order lifecycle | PROPOSED |
| OrderItem → InventoryItem allocation | 0:N | Logical allocation reference | Allocate sellable quantity to stock record | UNKNOWN: partial/multi-location fulfillment |
| ShipmentItem → InventoryItem allocation | 0:N | Logical allocation/consumption reference | Reconcile dispatch with stock | UNKNOWN: fulfillment allocation rules |
| Branch → InventoryLocation | 0:N or none | No default link | Allow future branch inventory only if confirmed | UNKNOWN: branch inventory |
| InventoryMovement → ReturnRequest | 0:1 | Optional source relationship | Explain approved restock/reject adjustment | UNKNOWN: return/restock policy |
| InventoryMovement → AuditLog | 0:N audit references | Audit target association | Trace stock adjustment actor/reason | PROPOSED |

## Customer, session, cart, and consent

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| Customer → CustomerAddress | 1:N | Address references one customer | Maintain approved reusable address records | PROPOSED; fields/retention unknown |
| Customer → CustomerSession | 1:N | Session optionally references customer | Support revocable account sessions | PROPOSED |
| Customer → CustomerConsent | 1:N | Consent optionally references customer | Track consent history | PROPOSED; legal basis unknown |
| Customer → NotificationPreference | 1:N | Preference optionally references customer | Honor approved channel preferences | PROPOSED |
| Cart → Customer | 0:1 | Cart may associate to an authenticated customer | Support account cart context | CLIENT DECISION REQUIRED: account policy |
| Cart → CustomerSession / guest context | 0:1 | Cart session scope | Support guest checkout/cart continuity | CLIENT DECISION REQUIRED |
| Cart → CartItem | 1:N | CartItem references one cart | Represent current purchase intent | PROPOSED |
| CartItem → Product/Variant/SKU | N:1 | Sellable subject reference | Validate requested product/option/quantity | UNKNOWN: variant/SKU policy |
| Cart → Order | 0:1 | Converted order reference | Trace one cart conversion when approved | PROPOSED; repeat/order policy unknown |
| CustomerConsent → NotificationPreference | 0:N | Preference uses consent evidence | Prevent non-approved channel use | PROPOSED |

## Order, payment, shipping, notification

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| Order → Customer | 0:1 | Order may reference registered customer | Support guest or registered purchase | CLIENT DECISION REQUIRED: guest/account model |
| Order → OrderItem | 1:N | OrderItem references one order | Preserve purchase line snapshots | PROPOSED |
| Order → OrderAddress | 1:N with role | Address snapshot references order and role | Preserve delivery/billing context | UNKNOWN: required roles/fields |
| Order → OrderStatusHistory | 1:N | History references one order | Append workflow transitions | PROPOSED |
| Order → OrderNote | 1:N | Note references one order | Support authorized operations/support notes | UNKNOWN: visibility/retention |
| Order → Payment | 1:N | Payment references one order | Allow multiple attempts/aggregates if policy permits | PROPOSED; payment methods unknown |
| Order → Shipment | 1:N | Shipment references one order | Support one or more shipment aggregates if needed | UNKNOWN: partial/multi-shipment need |
| Order → Notification | 0:N | Notification relates to order event | Record transactional communication | PROPOSED |
| Order → AuditLog | 0:N | Audit target association | Trace sensitive state changes | PROPOSED |
| OrderItem → current Product | 0:1 | Optional reference to current catalog product | Provide traceability without replacing snapshot | PROPOSED |
| OrderItem → current ProductVariant | 0:1 | Optional reference to current variant | Provide traceability without replacing snapshot | UNKNOWN: variants |
| OrderItem → SKU snapshot | 0:1 reference plus immutable value | OrderItem stores immutable SKU value and optional SKU reference | Preserve sellable identity at purchase | PROPOSED |
| Payment → PaymentAttempt | 1:N | Attempt references Payment | Track initiation/retry events | PROPOSED |
| PaymentAttempt → PaymentEvent | 1:N | Event references attempt | Normalize provider evidence/history | PROPOSED |
| Payment → Refund | 0:N | Refund references Payment | Track approved financial return | CLIENT DECISION REQUIRED |
| Payment → SettlementRecord | 0:N or N:M batch deferred | Settlement record reference | Reconcile provider settlement | UNKNOWN: provider reports |
| PaymentAttempt → IdempotencyKey | 0:1 | Command key reference | Prevent duplicate initiation | PROPOSED |
| PaymentEvent → OrderStatusHistory | 0:1 | Verified event may cause order transition | Trace causal evidence | PROPOSED |
| Shipment → ShipmentItem | 1:N | ShipmentItem references Shipment | Allocate order lines to shipment | UNKNOWN: partial shipment |
| ShipmentItem → OrderItem | N:1 | ShipmentItem references OrderItem | Preserve what shipped | PROPOSED |
| Shipment → ShippingRate | 0:1 selected | Selected quote reference | Trace selected service/cost | UNKNOWN: rate flow |
| Shipment → TrackingEvent | 1:N | Tracking event references Shipment | Preserve carrier/status history | PROPOSED |
| Shipment → ShippingLabel | 0:N | Label references Shipment | Track generated/retrieved label artifacts | UNKNOWN: label support |
| Shipment → DeliveryException | 0:N | Exception references Shipment | Handle delivery issues | UNKNOWN: exception workflow |
| Order → ReturnRequest | 0:N | Return request references Order | Support policy-gated return | CLIENT DECISION REQUIRED |
| ReturnRequest → Shipment | 0:1 | Optional shipment reference | Identify returned delivery | UNKNOWN: return model |
| ReturnRequest → OrderItem | 0:N | Optional requested item references | Support item-level return if approved | UNKNOWN: partial return |
| ReturnRequest → Refund | 0:N | Optional approved refund relation | Reconcile return/refund | UNKNOWN: policy |
| Notification → NotificationTemplate | 0:1 | Notification may use versioned template | Trace rendered message contract | PROPOSED |
| Notification → NotificationDelivery | 1:N | Delivery references one intent | Track channel attempts/results | PROPOSED |
| Notification → Order/Payment/Shipment | 0:1 each contextual target | Optional contextual source reference | Link event to authoritative source | PROPOSED |
| NotificationDelivery → Job | 0:N | Job execution reference | Retry asynchronous channel delivery | PROPOSED |

## Content, education, branch, media

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| Article → ArticleCategory | 1:N assignment | Assignment references Article and Category | Classify article in content taxonomy | PARTIAL: source memberships unknown |
| ArticleCategory → Category | N:1 | Assignment references scoped content Category | Avoid duplicate content category entity | PROPOSED |
| Article → ArticleTag | 1:N assignment | Assignment references Article and Tag | Classify sparse content tags | UNKNOWN: source tags |
| ArticleTag → Tag | N:1 | Assignment references scoped content Tag | Avoid duplicate tag entity | PROPOSED |
| Article → MediaUsage | 0:N | Usage target is Article | Attach featured/inline media | PROPOSED |
| Article → SeoMetadata | 0:1 active | SEO target reference | Manage article SEO data | PROPOSED |
| Page → MediaUsage | 0:N | Usage target is Page | Attach page media | PROPOSED |
| Page → SeoMetadata | 0:1 active | SEO target reference | Manage page SEO data | PROPOSED |
| Event → Branch | 0:1 | Optional branch reference | Relate approved event to branch | UNKNOWN: event/branch source |
| Event → MediaUsage | 0:N | Usage target is Event | Attach event media | PROPOSED |
| Event → SeoMetadata | 0:1 active | SEO target reference | Manage retained event SEO | CONDITIONAL |
| Gallery → MediaUsage | 1:N | Usage target is Gallery | Curate gallery assets | PROPOSED; rights unknown |
| Gallery → SeoMetadata | 0:1 active | SEO target reference | Manage gallery route metadata | CONDITIONAL |
| Testimonial → MediaUsage | 0:N | Optional testimonial media | Attach approved person/photo asset | CLIENT DECISION REQUIRED |
| EducationHub → EducationResource | 1:N | Resource references hub | Organize approved resources | PROPOSED |
| EducationHub → EducationRelation | 1:N | Relation references hub | Connect hub to content/product/page targets | PROPOSED |
| EducationRelation → Article/Product/Page/etc. | N:1 typed target | Polymorphic target reference | Implement contextual content-commerce links | CLIENT DECISION REQUIRED for relation policy |
| EducationHub → MediaUsage | 0:N | Usage target is hub | Attach approved hub media | PROPOSED |
| EducationHub → SeoMetadata | 0:1 active | SEO target reference | Manage hub canonical metadata | PROPOSED |
| Branch → BranchContact | 1:N | Contact references Branch | Publish approved contact channels | UNKNOWN: contact data |
| Branch → BranchLocation | 0:1 or 1:N | Location references Branch | Store approved address/map context | UNKNOWN: cardinality/data |
| Branch → MediaUsage | 0:N | Usage target is Branch | Attach approved local media | PROPOSED |
| Branch → SeoMetadata | 0:1 active | SEO target reference | Manage branch local SEO | CONDITIONAL |
| MediaAsset → MediaVariant | 1:N | Variant references source asset | Serve responsive/derived assets | PROPOSED |
| MediaAsset → MediaUsage | 1:N | Usage references asset | Reuse asset safely across entities | PROPOSED |
| ProductImage → MediaAsset | N:1 | ProductImage references asset | Role/order asset attachment | PROPOSED |
| ShippingLabel → MediaAsset | 0:1 | Optional secure artifact reference | Manage label document asset | UNKNOWN: label model |

## SEO, search, analytics, audit, system

| Relationship | Cardinality | Association concept | Purpose | Status / uncertainty |
|---|---|---|---|---|
| SeoMetadata → CanonicalReference | 0:1 active | Metadata may use canonical relation | Generate canonical output safely | PROPOSED |
| Redirect → CanonicalReference / target entity | 0:1 target | Redirect references approved canonical target | Map legacy source to relevant target | PARTIAL: source inventory incomplete |
| SitemapEntry → SeoMetadata | N:1 | Sitemap entry references target SEO state | Include only eligible canonical routes | PROPOSED |
| SitemapEntry → CanonicalReference | N:1 | Entry references canonical target | Avoid duplicate sitemap URLs | PROPOSED |
| SearchDocument → Product/Category/Article/Hub/Branch/Page | N:1 typed target | Derived document target reference | Index eligible public data | PROPOSED |
| SearchSynonym → Category/Hub/term scope | 0:N contextual reference | Optional semantic scope | Control approved synonym use | CLIENT DECISION REQUIRED |
| SearchRedirect → CanonicalReference | N:1 | Redirect target reference | Map approved query/legacy intent | DEFERRED |
| AnalyticsEvent → public route/entity | 0:1 typed target | Safe context reference | Measure discovery/engagement | PROPOSED |
| ConversionEvent → AnalyticsEvent | 0:1 | Derived/source event reference | Track conversion milestone | PROPOSED |
| ConversionEvent → Order/Payment/Shipment | 0:1 safe reference | Safe typed correlation reference | Correlate verified milestone without authority | PROPOSED |
| StaffUser → Role | N:M | StaffUserRole association | Assign proposed capabilities | CLIENT DECISION REQUIRED |
| Role → Permission | N:M | RolePermission association | Define capability bundles | CLIENT DECISION REQUIRED |
| StaffUser → AuditLog | 0:N | Actor reference | Trace staff actions | PROPOSED |
| AuditLog → target entity | N:1 typed target | Polymorphic target reference | Audit sensitive domain action | PROPOSED |
| OutboxEvent → aggregate entity | N:1 typed target | Aggregate/source reference | Publish durable domain event | PROPOSED |
| OutboxEvent → Job | 0:N | Job references source event | Execute asynchronous follow-up | PROPOSED |
| Job → JobAttempt | 1:N | Attempt references Job | Audit retries/execution | PROPOSED |
| IdempotencyKey → command/event aggregate | 0:1 typed reference | Scope duplicate protection | Prevent repeated side effects | PROPOSED |
| SystemSetting → module scope | N:1 logical scope | Setting owner/module reference | Apply approved configuration | PROPOSED; secret config excluded |
| AuditLog → OutboxEvent/Job/PaymentEvent | 0:N causal reference | Optional causal source reference | Trace system action causality | PROPOSED |

## 8. Relationship safeguards

- Historical OrderItem, OrderAddress, payment event, shipment event, inventory movement, audit, and notification records preserve their own snapshots/evidence; they must not depend on mutable catalog/profile data.
- N:M relationships use explicit logical assignment/association records so source provenance, ordering, state, and audit can be represented without duplicate arrays or ambiguous ownership.
- Typed target relationships require allowlisted target types and authorization/validation; they must not permit arbitrary cross-domain reference injection.
- Association/deletion behavior is lifecycle-aware: detach/archive/merge/redirect is preferred over destructive deletion when a source URL, historical order, audit, or legal record exists.
- Unknown relationships are implementation blockers only where the relevant feature needs the decision; they do not justify inventing source data.
