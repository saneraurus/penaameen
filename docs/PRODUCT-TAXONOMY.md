# PENA AMEEN Product Taxonomy

**Phase:** 2 — Information Architecture

**Status:** PROPOSED taxonomy model constrained by incomplete catalog evidence. This document preserves verified source taxonomy and explicitly avoids inventing new product categories, variants, attributes, or packages.

## 1. Taxonomy objective

The product taxonomy must help a customer browse PENA AMEEN products and help staff migrate/manage them without creating competing archives or hiding source SEO assets. It is not a seller taxonomy and does not create a multi-vendor catalog model.

## 2. Definitions

| Term | Definition in this project | Public archive by default? | Example/status |
|---|---|---|---|
| Category | Stable primary product browse grouping with a clear customer and SEO purpose. A product can belong to one or more only when source data supports it. | Yes, only when retained and meaningful | Existing `al-barqy`, `flashcard`, `cd`, `umum` |
| Tag | Sparse cross-cutting descriptor used only where category/attribute is insufficient. | No; requires separate SEO purpose decision | Existing `ernuwidodo` is a legacy review item |
| Attribute | Descriptive/selectable/filterable product property. It can support staff operations or an optional filter. | No | Educational method, format, package form |
| Variant | Purchasable option under a product, with its own availability/price/SKU where applicable. | No | UNKNOWN whether source variants exist |
| Product type | Operational/commercial form of a product record. | No | Source likely simple products; not confirmed |
| Package/bundle | A product composition containing multiple materials/items. | No | “Paket” is evidenced; contents/rules are UNKNOWN |
| Product family | Cross-product educational or thematic relationship used for discovery/context. | No, unless client later approves a category/archive | ACM can be a product family/classification |
| Collection | Curated editorial grouping for a campaign/home/hub. | No permanent route by default | Not required or evidenced for MVP |

## 3. Source evidence

| Source taxonomy/evidence | What is known | What is not known |
|---|---|---|
| `/product-category/al-barqy/` | Indexed legacy product category; at least three detectable ALBARQY products; critical SEO value | Full product count, description, hierarchy, metadata, all product relationships |
| `/product-category/flashcard/` | Indexed legacy category; at least one related package/product listing | Full product membership, whether it is a format or a commercial family |
| `/product-category/cd/` | Indexed legacy category; at least one CD/ACM/ALBARQY package listing | Full membership, actual media/format taxonomy role |
| `/product-category/umum/` | Indexed legacy general-products category | Purpose, future relevance, full membership, retention decision |
| `/product-tag/ernuwidodo/` | Indexed legacy product tag linked to a general/legal book | Tag meaning, whether it is author/person/topic, SEO value, public future |
| AL-BARQY products | Multiple educational packages and a category are observed | Package contents, variants, stock, all products |
| ACM products | ACM product names/packages observed and ACM educational content exists | Confirmed product-category archive, complete catalog, product-family rules |
| “Paket” labels | Several products appear to be packages | Whether bundles are fixed, configurable, variant-like, or inventory-linked |

## 4. Proposed primary product categories

The following are **legacy categories to preserve for migration analysis**, not a mandate to add new category levels.

| Category | Canonical candidate | Customer purpose | Evidence | Proposed treatment | Status |
|---|---|---|---|---|---|
| AL-BARQY | `/product-category/al-barqy/` | Browse PENA AMEEN products associated with the AL-BARQY method | Confirmed indexed source category and products | Retain as a primary product category; connect contextually to the AL-BARQY hub | PROPOSED / migration-sensitive |
| Flashcard | `/product-category/flashcard/` | Browse source products grouped under Flashcard | Confirmed indexed source category | Retain as a primary legacy browse category until catalog review; do not create children | PROPOSED / migration-sensitive |
| CD | `/product-category/cd/` | Browse source products grouped under CD | Confirmed indexed source category | Retain as a primary legacy browse category until catalog review; do not create children | PROPOSED / migration-sensitive |
| Umum | `/product-category/umum/` | Browse general products if the source category remains meaningful | Confirmed source route, medium SEO value | Preserve route/data, then decide retain, rename, merge, or archive through client/SEO review | CLIENT DECISION REQUIRED |

### Secondary categories

**No secondary product-category hierarchy is proposed in Phase 2.** The current evidence does not establish parent/child category relationships, and adding children under AL-BARQY, Flashcard, CD, or Umum would invent taxonomy. Format, method, and package information should remain attributes/classifications until catalog evidence and a shopper/SEO purpose justify a category.

### Important boundary: ACM

ACM is **not** listed above as a primary product category because the discovery evidence does not confirm an existing `/product-category/acm/` archive. ACM is a confirmed educational pillar and observed product family, but creating a new category route would be an unsupported taxonomy invention.

**Proposed treatment:** classify approved ACM products with the `educational method/family = ACM` attribute and expose them through the ACM education hub. A dedicated public ACM product category is `CLIENT DECISION REQUIRED` after complete catalog and SEO review.

## 5. Proposed secondary classifications and attributes

These are data/classification candidates only. They do not automatically create public URLs, navigation labels, or filters.

| Attribute / classification | Candidate values evidenced | Purpose | Public behavior | Status |
|---|---|---|---|---|
| Educational method/family | AL-BARQY; ACM; Unknown/not classified | Relate product to an educational pillar and relevant content | Contextual links/hub product selection only when supported | PROPOSED |
| Material/format | Flashcard; CD; poster; book; Unknown | Describe product form and preserve source category context | May support filter/display later; no indexable facet route | PROPOSED / partial evidence |
| Commercial form | Package; single item; Unknown | Explain product composition and fulfillment context | Product-detail information only | PROPOSED / partial evidence |
| Product availability | Available; unavailable; unknown | Support purchase eligibility | Product/card state only; not category | PROPOSED; source rule unknown |
| Price state | Regular price; sale price where verified | Support evaluation and checkout | Product/card data only; not a taxonomy | PROPOSED; pricing rules unknown |
| Audience/age/use case | UNKNOWN | Potential future discovery context | Do not create/use until source/client evidence exists | UNKNOWN |
| Language/edition/level | UNKNOWN | Potential future selection/variant data | Do not create/use until catalog confirms it | UNKNOWN |
| Weight/dimensions | UNKNOWN | Shipping/fulfillment information | Operational/product data, never navigation taxonomy | UNKNOWN |

## 6. Tags

### Rule

A product tag may exist only when it answers a distinct discovery question that a category or attribute cannot answer, has maintained membership, and has an approved indexability/URL purpose.

### Current legacy tag

| Tag | Known use | Proposed action | Status |
|---|---|---|---|
| `ernuwidodo` | Indexed product-tag archive connected to `PENGANTAR ILMU HUKUM` | Preserve as a legacy migration record; do not expose as a new navigation/facet/archive until its meaning, membership, and SEO value are confirmed | CLIENT DECISION REQUIRED |

Tags must not be created for every author, product format, education method, package, category, color, price band, or marketing claim. They are not a substitute for a product category.

## 7. Variants, product types, and packages

| Concept | Current finding | IA treatment | Decision/data gate |
|---|---|---|---|
| Variants | UNKNOWN; source may use WooCommerce variations | Remain inside a product detail; no variant route or category | WooCommerce export and operations rules |
| Simple product | INFERRED from URL/cart/price patterns | May remain an operational type, not public taxonomy | Export confirmation |
| Package/bundle | Multiple “Paket” names observed | Treat as product-detail composition; preserve included content and fulfillment rules when data exists | Package contents, stock, pricing, weight rules |
| Configurable bundle | UNKNOWN | Do not introduce | Client/product/operations decision |
| Related/cross-sell/upsell | Partially observed snippets only | Curated/source-confirmed contextual links, no taxonomy | Product export/editorial approval |

## 8. Product taxonomy governance

### Category admission test

A new product category needs all of the following:

1. a distinct customer browse intent;
2. enough active products or a documented launch/SEO purpose;
3. a category name/slug that does not duplicate an existing category, tag, method hub, or filter;
4. accountable category description/SEO ownership;
5. a source or approved migration decision; and
6. a clear route/indexability treatment.

### Attribute/filter admission test

An attribute can become a customer-facing filter only when the catalog has reliable values, the filter solves a real browsing task, and it will not create indexable duplicate pages.

### No taxonomy action

Do not create categories for: featured products, sale products, newest, popular, price bands, branch regions, stock states, package labels, editorial campaigns, testimonials, authors, or unverified audience claims unless a separate approved product/SEO decision establishes a durable purpose.

## 9. Open decisions

- Final treatment of `Umum` (`CDR-011`).
- Whether ACM becomes a public product category after catalog/SEO review (`CDR-027`).
- Product-tag `ernuwidodo` meaning and route treatment (`CDR-022`).
- Complete taxonomy hierarchy/membership, variants, packages, related products, audience/level data, stock rules, and merchandising filters (`CDR-002`, `CDR-011`, `CDR-012`).
- Final public category labels/language and SEO metadata after source export.
