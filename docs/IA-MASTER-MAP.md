# PENA AMEEN IA Master Map

**Phase:** 2 — Information Architecture

**Status:** Canonical proposed hierarchy for Phase 2. It consolidates the public, account, and administrative IA documents. Route patterns are canonical candidates and remain subject to legacy migration/source-data/client approval.

## 1. Master hierarchy

```text
PUBLIC
├── Home /
│   ├── Shop entry
│   ├── Education entry
│   ├── Branches entry
│   ├── Profile / help entry
│   └── Commerce utilities
│
├── Shop /shop/
│   ├── All products
│   ├── Product categories /product-category/[slug]/
│   │   ├── AL-BARQY                  [retained legacy category]
│   │   ├── Flashcard                 [retained legacy category]
│   │   ├── CD                        [retained legacy category]
│   │   └── Umum                      [decision required]
│   ├── Product tags /product-tag/[slug]/ [legacy treatment only]
│   ├── Product /product/[slug]/
│   └── Search /search/?scope=products
│
├── Education /education/
│   ├── AL-BARQY hub /education/al-barqy/
│   │   ├── retained AL-BARQY articles
│   │   └── AL-BARQY product category / selected products
│   ├── ACM hub /education/acm/
│   │   ├── retained ACM articles
│   │   └── ACM product family / selected products
│   ├── Blog /blog/
│   │   ├── Article /[article-slug]/
│   │   ├── Content categories /category/[slug]/ [conditional]
│   │   ├── Tags /tag/[slug]/          [conditional]
│   │   └── Authors /author/[slug]/    [conditional]
│   └── Search /search/?scope=education
│
├── Branches /branches/
│   ├── Branch /branches/[slug]/        [proposed target]
│   ├── Events /events/                 [conditional]
│   │   └── Event /events/[slug]/       [conditional]
│   └── Gallery /galeri-kegiatan/       [conditional legacy route]
│
├── Profile /profile/
│
├── Help
│   ├── Contact /contact/
│   ├── FAQ /faq/                       [conditional approved content]
│   ├── Tracking /tracking/
│   └── Legal
│       ├── Privacy /legal/privacy/
│       ├── Terms /legal/terms/
│       ├── Shipping /legal/shipping/
│       └── Returns/Refunds /legal/returns-refunds/
│
└── Commerce state
    ├── Cart /cart/
    ├── Checkout /checkout/
    └── Order result /order/confirmation/[secure-reference]/

ACCOUNT (conditional private space)
├── Account overview /account/
├── Login /account/login/
├── Register /account/register/
├── Password reset /account/password-reset/
├── Orders /account/orders/
│   └── Order detail /account/orders/[order-reference]/
├── Profile /account/profile/
└── Addresses /account/addresses/

ADMIN (private staff space)
├── Dashboard /admin/
├── Commerce operations
│   ├── Orders /admin/orders/
│   │   └── Order detail /admin/orders/[id]/
│   ├── Fulfillment & Shipping /admin/fulfillment/
│   ├── Payments /admin/payments/
│   └── Customers /admin/customers/
│       └── Customer detail /admin/customers/[id]/
├── Catalog
│   ├── Products /admin/products/
│   │   └── Product editor /admin/products/[id]/
│   ├── Categories /admin/catalog/categories/
│   ├── Tags /admin/catalog/tags/         [conditional]
│   ├── Inventory /admin/inventory/
│   └── Promotions /admin/promotions/     [conditional]
├── Content & community
│   ├── Content /admin/content/
│   │   └── Content editor /admin/content/[id]/
│   ├── Content taxonomy /admin/content/taxonomy/
│   ├── Media /admin/media/
│   ├── Branches /admin/branches/         [conditional]
│   └── Events /admin/events/             [conditional]
├── Discovery & measurement
│   ├── SEO /admin/seo/
│   ├── Redirects /admin/seo/redirects/
│   └── Analytics /admin/analytics/       [conditional]
└── Settings
    ├── Settings /admin/settings/
    └── Staff access /admin/settings/access/
```

## 2. Hierarchy decisions

| Decision | Rationale | Status |
|---|---|---|
| Shop is a primary public section | Commerce must be immediately discoverable and source `/shop/` has high confidence/critical SEO value | CONFIRMED requirement; proposed hierarchy |
| Education groups AL-BARQY, ACM, and Blog | Avoids three competing top-level items while preserving core educational discovery | PROPOSED |
| AL-BARQY and ACM are hubs, not separate site roots | They need a coherent education context and controlled content-to-commerce links | PROPOSED; CDR-027 |
| Product category routes retain legacy `/product-category/` structure | Prevents unnecessary SEO-risky route rewrite | PROPOSED; source validation required |
| Root-level retained articles remain root-level | Preserves established article slug equity and avoids duplicate `/blog/[slug]/` copies | PROPOSED; source validation required |
| Branches get one public grouping | Supports local/community intent without separate Komunitas/Mitra Cabang/Gallery top-level labels | PROPOSED; active branch/event data required |
| Profile remains `/profile/` even if label becomes About | Avoids duplicate content route caused by a label change | PROPOSED |
| Account and Admin are isolated private hierarchies | Prevents private/stateful content from polluting public navigation/SEO | CONFIRMED requirement |
| Cart/Checkout/Order/Tracking are service states | Supports commerce loop without treating transaction states as public-content sections | CONFIRMED requirement |

## 3. IA completeness conditions

The master map is complete as a Phase 2 structure but is not approved for destructive routing/migration until:

- full source URL/content/catalog/media/SEO inventory is received;
- client decisions on navigation labels, taxonomy, AL-BARQY/ACM, branches/events/gallery, accounts, and legacy mappings are made;
- every legacy source URL has a validated target/treatment;
- final route/indexability/canonical behavior is validated through later technical/SEO work.

See `docs/IA-AUDIT.md`, `docs/LEGACY-URL-MAPPING.md`, `docs/URL-ARCHITECTURE.md`, and `docs/CLIENT-DECISION-REGISTER.md`.
