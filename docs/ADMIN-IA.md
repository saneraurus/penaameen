# PENA AMEEN Administrative Information Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED internal task hierarchy. It describes navigation groups, entity relationships, operational paths, and conceptual role boundaries. It does not implement authentication, permissions, database schema, providers, dashboards, or staff workflows.

## 1. Admin IA objective

The admin IA is intentionally deeper than public navigation. It organizes PENA AMEEN staff work around the lifecycle of catalog, content, order, payment, fulfillment, shipping, customer support, SEO, and settings — not around public pages or a seller marketplace model.

## 2. Canonical admin hierarchy

```text
ADMIN /admin/
├── Overview
│   └── Dashboard / work queues
│
├── Commerce operations
│   ├── Orders
│   │   └── Order detail
│   ├── Fulfillment & Shipping
│   ├── Payments
│   └── Customers
│       └── Customer detail
│
├── Catalog
│   ├── Products
│   │   └── Product detail / editor
│   ├── Categories
│   ├── Tags
│   ├── Inventory
│   └── Promotions                    [conditional]
│
├── Content & community
│   ├── Content (articles/pages)
│   │   └── Content detail / editor
│   ├── Content taxonomy
│   ├── Media
│   ├── Branches                      [conditional]
│   └── Events                        [conditional]
│
├── Discovery & measurement
│   ├── SEO
│   ├── Redirects
│   └── Analytics
│
└── Settings
    └── Staff access / capability assignments
```

The hierarchy has no seller, seller payout, vendor catalog, vendor support, or marketplace dispute branch.

## 3. Navigation groups and destinations

| Group | Destination | Route pattern | Primary job | Key relationships | Scope status |
|---|---|---|---|---|---|
| Overview | Dashboard | `/admin/` | Surface approved work queues and exceptions | Orders, payment, shipping, products, SEO, analytics | MUST HAVE concept |
| Catalog | Products | `/admin/products/` | Find/manage PENA AMEEN products | Categories, inventory, media, SEO, orders | MUST HAVE |
| Catalog | Product detail/editor | `/admin/products/[id]/` | Maintain approved product/content/commercial data | Product → category/attribute/media/inventory/SEO | MUST HAVE |
| Catalog | Categories | `/admin/catalog/categories/` | Manage retained product categories safely | Products, legacy URLs, SEO | MUST HAVE |
| Catalog | Tags | `/admin/catalog/tags/` | Review/manage approved product tags only | Products, legacy tag archives, SEO | CLIENT DECISION REQUIRED |
| Catalog | Inventory | `/admin/inventory/` | Review/update approved stock data | Products, SKU, orders, shipping | MUST HAVE |
| Catalog | Promotions | `/admin/promotions/` | Manage approved promotions/coupons | Products, pricing, orders | CLIENT DECISION REQUIRED |
| Commerce | Orders | `/admin/orders/` | Search/filter/prioritize orders | Customers, payments, fulfillment/shipping | MUST HAVE |
| Commerce | Order detail | `/admin/orders/[id]/` | Inspect and progress authorized order context | Order lines, payment, shipment, customer, notes | MUST HAVE |
| Commerce | Fulfillment & Shipping | `/admin/fulfillment/` | Prepare shipments, AWB/resi, labels, tracking/exceptions | Eligible order, package, provider workflow | MUST HAVE concept |
| Commerce | Payments | `/admin/payments/` | View/reconcile approved payment/refund status | Orders, finance action, events | MUST HAVE concept |
| Commerce | Customers | `/admin/customers/` | Find authorized customer/support context | Orders, contact, consent, account data | SHOULD HAVE |
| Commerce | Customer detail | `/admin/customers/[id]/` | View permitted customer/order context | Customer → orders/shipping/contact | SHOULD HAVE |
| Content | Content list | `/admin/content/` | Manage articles/pages content lifecycle | Taxonomy, media, SEO, product links | MUST HAVE |
| Content | Content editor | `/admin/content/[id]/` | Edit/publish approved article/page | Content → media/taxonomy/links/SEO | MUST HAVE |
| Content | Content taxonomy | `/admin/content/taxonomy/` | Manage approved categories/tags safely | Articles, hubs, legacy archive routes | MUST HAVE |
| Content | Media | `/admin/media/` | Manage approved media/alt/context/rights data | Products, content, branches/events | MUST HAVE |
| Content | Branches | `/admin/branches/` | Maintain approved active branch data | Branch pages, local SEO, contact | CLIENT DECISION REQUIRED |
| Content | Events | `/admin/events/` | Maintain approved events if continued | Event routes, branch/content/media | CLIENT DECISION REQUIRED |
| Discovery | SEO | `/admin/seo/` | Maintain/validate metadata, canonicals, indexability | Products, content, categories, branches | MUST HAVE |
| Discovery | Redirects | `/admin/seo/redirects/` | Control old-to-new route treatment and validation | Legacy URL mapping, SEO, content/products | MUST HAVE |
| Discovery | Analytics | `/admin/analytics/` | Review approved reporting/measurement context | Funnel/events/SEO migration monitoring | CLIENT DECISION REQUIRED |
| Settings | Settings | `/admin/settings/` | Maintain approved operational configuration references | All domains | MUST HAVE concept |
| Settings | Staff access | `/admin/settings/access/` | Manage conceptual capability assignments | Staff capability profiles, audit/approval | MUST HAVE concept |

## 4. Entity relationships

```text
Product
├── product category / tag / attributes
├── inventory / SKU / media / SEO
├── order item
├── related product or education content
└── package/variant data when confirmed

Order
├── customer context
├── order items / product snapshot
├── payment state
├── fulfillment/shipment/tracking state
└── notification/support history where approved

Content
├── content category/tag/author
├── media / SEO / redirects
├── education hub relationship
└── relevant product/category links

Branch / Event
├── content/media
├── local/contact context
└── SEO/redirect treatment
```

These relationships define information adjacency for staff; they do not define database entities or permission implementation.

## 5. Operational workflow paths

### 5.1 Catalog workflow

```text
Products list → Product detail/editor
  → category/tag/attribute/media/SEO context
  → inventory context
  → publish/archive decision with URL/SEO warning
```

A product archive/delete action must lead to a migration/SEO treatment check rather than a casual content removal.

### 5.2 Order to fulfillment workflow

```text
Orders list → Order detail
  → payment status / eligibility review
  → fulfillment & shipping workspace
  → shipment / AWB-resi / label / tracking state
  → customer support or exception queue
```

Payment, order, shipment, and tracking states remain distinct. The workflow does not assume a specific provider or an automatic/manual trigger rule.

### 5.3 Content and SEO workflow

```text
Content list → Content editor
  → taxonomy / media / internal links
  → metadata / canonical / indexability review
  → redirect review if public route changes
```

### 5.4 Migration/SEO workflow

```text
Legacy URL map → Redirect workspace
  → target content/product/category route
  → owner/status/reason
  → validation result / post-launch monitoring
```

## 6. Conceptual role boundaries

| Capability profile | Core admin groups | Conceptual boundary |
|---|---|---|
| Administrator | Overview, Settings, access, cross-domain exceptions | May oversee configuration/access but does not automatically receive unrestricted finance/customer data. |
| Product manager | Products, categories, inventory, media, SEO | Price/inventory/publish authority requires client-approved boundaries. |
| Order manager | Orders, customer context, payment/shipping status | Refund/payment override authority is not presumed. |
| Fulfillment/shipping manager | Fulfillment & Shipping, eligible order detail | Can act only on approved shipment workflow; package/origin/provider rules are unknown. |
| Content manager | Content, content taxonomy, media, SEO | Publishing/redirect authority requires an approved editorial/SEO process. |
| SEO manager | SEO, redirects, content/product route context | Cannot change migration-sensitive URLs without documented review. |
| Customer support | Orders, customer detail, tracking context | Sees only permitted data; no broad account/payment credential access. |

The final permission model, staff combinations, approval thresholds, audit trails, and emergency access are outside Phase 2 and remain `CDR-010` decisions.

## 7. Admin IA guardrails

- Admin routes are internal/non-indexable and do not appear in public navigation/search/sitemap.
- A task-specific workspace must not be duplicated under multiple unrelated menu groups; detail views link to adjacent entities instead.
- Promotions, branches, events, tags, analytics, and customer self-service remain conditional until source/policy decisions are made.
- There is no vendor/seller hierarchy.
- There is no provider-specific payment/shipping screen design in this IA.
- Every sensitive action needs a later approved permission/audit model; this document does not infer authority from navigation access.

## 8. Open dependencies

Catalog, inventory, product lifecycle, payment/shipping workflow, refunds, customer data/privacy, staff role/SOP, branch/event continuation, promotion policy, analytics reporting, source exports, and redirect matrix remain prerequisites for final admin architecture.
