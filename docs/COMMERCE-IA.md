# PENA AMEEN Commerce Information Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED commerce structure. It defines destinations and relationships, not product data schema, payment/shipping provider behavior, pricing policy, inventory rules, or UI implementation.

## 1. Commerce journey hierarchy

```text
Shop /shop/
  ↓
Retained product category /product-category/[slug]/
  ↓
Product list and contextual discovery
  ↓
Product detail /product/[slug]/
  ↓
Cart /cart/
  ↓
Checkout /checkout/
  ↓
Order outcome /order/confirmation/[secure-reference]/
  ↓
Tracking /tracking/ or authorized account order detail
```

Product search is an alternate entry path:

```text
Search /search/?scope=products
  ↓
Product / category / education result
  ↓
Product detail or relevant discovery destination
```

The journey is not linear in every session: a visitor can return from Cart to Shop, from an article to a product, or from Tracking to Help. The route hierarchy must nevertheless preserve clear task state and prevent checkout/tracking pages from becoming public SEO destinations.

## 2. Commerce destination roles

| Destination | Route pattern | Role | Parent/discovery path | Indexability | Status |
|---|---|---|---|---|---|
| Shop | `/shop/` | All-products catalog and primary commerce entry | Primary nav, home, footer, search | Indexable | MUST HAVE; legacy-sensitive |
| Product category | `/product-category/[slug]/` | Stable retained browse archive | Shop secondary/contextual navigation, legacy landing, search | Indexable when retained | MUST HAVE for verified legacy categories |
| Product tag archive | `/product-tag/[slug]/` | Conditional legacy cross-cutting archive | Legacy redirect/direct route only unless a distinct shopper/SEO purpose is approved | Conditional; noindex by default until reviewed | CLIENT DECISION REQUIRED |
| Product detail | `/product/[slug]/` | Evaluate one PENA AMEEN product and add valid item to cart | Category, Shop, search, education/content links | Indexable when active | MUST HAVE; critical legacy route |
| Cart | `/cart/` | Edit intended purchase and begin valid checkout | Utility navigation, product detail | Non-indexable | MUST HAVE |
| Checkout | `/checkout/` | Collect/review order, shipping, payment information | Cart only / approved direct recovery | Non-indexable | MUST HAVE |
| Order outcome | `/order/confirmation/[secure-reference]/` | Show truthful created/pending/verified/recovery outcome | Checkout/provider return only | Non-indexable | MUST HAVE |
| Tracking entry | `/tracking/` | Start approved post-purchase lookup/tracking task | Utility/help/notification/account | Non-indexable | MUST HAVE outcome |
| Tracking result | `/tracking/[secure-reference]/` | Show authorized shipment/order status | Tracking entry, notification, account | Non-indexable | MUST HAVE outcome |

## 3. Product, category, tag, attribute, variant, package, and related-product relationships

| Concept | IA purpose | Public route expectation | What it is not | Current evidence/status |
|---|---|---|---|---|
| Product | Purchasable PENA AMEEN item with a stable public identity | `/product/[slug]/` | A category, tag, or seller storefront | Known source products partial; canonical product data incomplete |
| Product category | Stable primary browse grouping with customer/SEO purpose | `/product-category/[slug]/` for retained source categories | A generic filter, attribute, or menu label | `al-barqy`, `flashcard`, `cd`, `umum` discovered; taxonomy mixed |
| Product tag | Sparse cross-cutting descriptor only when it has a distinct purpose | Conditional legacy archive only | A duplicate category, author, format, program, or product family shortcut | `ernuwidodo` discovered; purpose/retention unresolved |
| Product attribute | Describes/selects a product or supports filtering/operations | No indexable route by default | A category or tag archive | Method, format, package details only partially evidenced |
| Variant | A purchasable option under one product | Product-detail state, no public route of its own | A standalone product/category | UNKNOWN whether source variants exist |
| Package/bundle | A product composition/form that affects product detail/fulfillment | Product detail, no taxonomy route by default | A category merely because it is a package | Multiple “Paket” products evidenced; contents/rules UNKNOWN |
| Related product | Contextual relationship that helps evaluation/discovery | Links from product/article/hub | An automated recommendation engine or required cross-sell | Existing relationships partially observed; needs source/editorial approval |
| Editorial collection | Temporary/purposeful arrangement such as a home feature or education hub selection | No permanent taxonomy route unless separately approved | A substitute category or duplicate archive | Not required for MVP |

## 4. Product discovery model

### 4.1 Shop

`/shop/` is the primary all-products entry and retains the high-confidence legacy Shop intent. It can surface approved featured/category/education links, but its central job is an eligible product listing.

### 4.2 Product categories

The existing product-category routes are migration-sensitive. Retained categories must have a clear shopper/SEO purpose and a meaningful product list/context.

| Source category | IA role | Proposed public treatment | Decision status |
|---|---|---|---|
| `al-barqy` | Method/product-family browse route | Retain canonical legacy product-category route and connect it to the AL-BARQY education hub | PROPOSED; source category is confirmed |
| `flashcard` | Legacy format/product browse route | Retain pending catalog/taxonomy review; do not invent child categories | PROPOSED |
| `cd` | Legacy format/product browse route | Retain pending catalog/taxonomy review; do not invent child categories | PROPOSED |
| `umum` | Legacy catch-all/general browse route | Preserve source route while client decides its final purpose/merger/retention | CLIENT DECISION REQUIRED |
| ACM | Educational product family, not confirmed source product category | Expose via ACM hub/product classification only; do not create `/product-category/acm/` yet | CLIENT DECISION REQUIRED |

### 4.3 Search

Global search has a product scope and can return products, retained categories, education hubs, and approved articles. Search does not create a replacement category system or indexable query archives. See `docs/SEARCH-IA.md`.

### 4.4 Content-to-commerce paths

Education hubs and articles provide contextual entry into Shop/category/product where relevant. A content route must never be the only way to discover a purchasable product; Shop/search/category remain independent paths.

## 5. Product-detail IA

The product detail is the information convergence point for:

```text
Product identity
├── approved images and media context
├── description / package content when verified
├── regular and sale price when verified
├── availability / valid option state when verified
├── category and method context
├── related products/content when approved
├── add to cart
└── SEO/internals links
```

### Product-detail relationships

- **Parent:** a retained category where product membership is known; otherwise Shop/search entry remains valid.
- **Method context:** AL-BARQY or ACM hub only when source/product classification supports it.
- **Package/variant:** rendered within the product context, never as an independent SEO route by default.
- **Related products:** curated/source-confirmed links only; no generic “similar” route is assumed.
- **Cart:** valid cart action; no checkout bypass is assumed.

## 6. Cart, checkout, order, and tracking IA

### Cart

Cart is a private transaction workspace. It connects valid product lines to checkout, allows a return to Shop, and makes shipping estimate/availability state understandable. It is not a category, collection, or crawlable landing page.

### Checkout

Checkout is one task route with logical information states: customer information, address/destination, shipping selection, payment selection, review, and outcome. These states must not become duplicate indexable pages. See `docs/CHECKOUT-IA.md`.

### Order outcome

Order outcome lives after checkout/payment initiation. It can represent pending, verified success, failure, expiration, cancellation, or recovery without falsely claiming payment or shipment success. The route uses a secure-reference placeholder conceptually; final access/security behavior is later work.

### Tracking

Tracking is a service route with an entry and authorized result state. It is reachable through utility, customer notifications, account order detail, and help, but it is not indexed or exposed through public catalog/content navigation.

## 7. Collections and merchandising boundary

No permanent “collection” taxonomy is introduced in Phase 2. The existing evidence does not establish seasonal collections, campaigns, bestseller groups, age bands, price bands, or seller collections.

An editorially curated set may appear within Home, Shop, a product category, or an education hub if it has:

- an accountable owner;
- a clear visitor purpose;
- valid source products;
- no duplicate indexable route by default; and
- no unverified promotional claim.

## 8. Commerce IA guardrails

- Do not create `/shop/[category]/`, `/shop/product/[slug]/`, `/product-category/acm/`, or other parallel patterns merely for neatness while legacy routes remain authoritative.
- Do not use tags as a replacement for the mixed source category model.
- Do not create indexable routes for variants, packages, filters, sort order, search terms, cart, checkout, account, order, or tracking.
- Do not add seller/vender/storefront routes; PENA AMEEN remains single-vendor.
- Do not assume review, rating, wishlist, comparison, coupon, loyalty, subscription, or related-product mechanics.
- Do not remove a legacy category/tag/product route until `docs/LEGACY-URL-MAPPING.md` has a validated source and destination decision.

## 9. Dependencies and decisions

The commerce IA becomes final only when the catalog export, product states, SKU/inventory, variants/packages, price/promotion policy, product taxonomy, source URL/SEO data, and migration actions are approved. Payment and shipping destinations are defined as business flows only; provider-specific IA is intentionally absent.
