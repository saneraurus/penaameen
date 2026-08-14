# PENA AMEEN Data Migration Model

**Phase:** 4 — Data Architecture

**Status:** Migration blueprint only. Source completeness is not claimed. Every mapping remains `CONFIRMED`, `PARTIAL`, or `UNKNOWN` according to discovery evidence and client decisions. No data import is performed.

## 1. Migration principles

- Existing WordPress/WooCommerce and associated exports are source systems, not target architecture.
- Preserve source identity/provenance, URLs, slugs, relationships, and validation status where data is available.
- Do not manufacture missing SKU, inventory, media rights, product, content, payment, shipment, customer, or SEO data.
- Validate before publish/cutover; quarantine invalid/unresolved records rather than silently dropping them.
- Historical customer/order/payment/shipment migration is policy/legal/finance gated.
- Source URL treatment remains governed by legacy mapping and SEO migration documents.

## 2. Migration mappings

| Map ID | Source | Transformation | Target domain/entity | Validation | Failure handling | Source status |
|---|---|---|---|---|---|---|
| M-001 | WooCommerce product export | Preserve source ID/slug/name/status/descriptions/commercial fields where supplied | Catalog: Product | Unique source ID; required name/slug/status; URL/taxonomy/media cross-check | Quarantine incomplete/duplicate product; document exclusion/redirect, never invent fields | PARTIAL |
| M-002 | WooCommerce variation export | Map parent/options/SKU/price/stock only if variations exist | Catalog: ProductVariant | Parent exists; option/SKU uniqueness; product relation valid | Hold as unresolved if source variation data absent/inconsistent | UNKNOWN |
| M-003 | Package/bundle source sheet/export | Map explicit composition/version/quantities only if supplied | Catalog: ProductPackage | Parent/components exist; no cycle; stock policy approved | Keep product as non-package or hold; do not infer components | PARTIAL/UNKNOWN |
| M-004 | WooCommerce SKU/export/warehouse sheet | Normalize source SKU and map to sellable subject | Catalog: SKU | Duplicate/missing/format check; one subject mapping | Block inventory/publish readiness until resolved | UNKNOWN |
| M-005 | Product category export | Preserve IDs/slugs/descriptions/parent/indexability/source URL | Taxonomy: Category/CategoryProduct | Slug/source URL uniqueness; membership count; SEO mapping | Hold archive/redirect treatment; do not collapse taxonomy silently | PARTIAL |
| M-006 | Product tag export | Preserve source tag identity/membership for review | Taxonomy: Tag/TagProduct | Scope/slug/membership/indexability decision | Merge/redirect/noindex only through approved SEO decision | PARTIAL/UNKNOWN |
| M-007 | WooCommerce stock export/warehouse sheet | Map on-hand/status/location only after reconciliation | Inventory: InventoryItem/Location/Movement initial balance | SKU map; valid quantity; approved location; signed reconciliation | Block sellable inventory; do not default stock | UNKNOWN |
| M-008 | Product media/media library | Map source file/ID/role/order/alt to asset/usage | MediaAsset/MediaUsage/ProductImage | File availability/checksum/MIME/right/usage/alt validation | Quarantine unknown/broken/unlicensed media | UNKNOWN |
| M-009 | Product documents/downloads | Map only approved files/access rules | ProductDocument/MediaAsset | Product/file/right/access validation | Exclude/hold without inventing download policy | UNKNOWN |
| M-010 | WordPress post export | Preserve ID/root slug/title/body/excerpt/date/author/status | Content: Article | URL/body/media/taxonomy/link/metadata comparison | Hold unpublished/unmapped content; redirect decision for source URL | PARTIAL |
| M-011 | WordPress article categories/tags/authors | Map source taxonomy/attribution relationships | Category/Tag/ArticleCategory/ArticleTag/author metadata | Scope/slug/membership/archive treatment validation | Keep unresolved archive mapping blocked | PARTIAL/UNKNOWN |
| M-012 | WordPress page export | Preserve ID/route/title/body/status/media | Content: Page | Page inventory/route/internal link/SEO validation | Hold/redirect/archive only by content/SEO decision | PARTIAL |
| M-013 | Educational AL-BARQY/ACM source content/category/product evidence | Create approved hub/resource/relation records only after review | EducationHub/EducationResource/EducationRelation | Hub route, source relation, editorial/product-link approval | Do not infer ACM category/product relation | PARTIAL |
| M-014 | Branch directory/source pages | Map active branch name/status/contact/location/media/URL | Branch/BranchContact/BranchLocation | Client sign-off, route/local SEO/data accuracy | Archive/redirect/hold inactive/unknown branches | PARTIAL |
| M-015 | Events, gallery, testimonial source | Map only approved retained content/media/consent | Event/Gallery/Testimonial/MediaUsage | Rights, date/location/status, content/route validation | Hold/archived/redirect by client decision | UNKNOWN/PARTIAL |
| M-016 | SEO plugin export/raw crawl | Map title/description/canonical/indexability/schema/OG/image data | SeoMetadata/CanonicalReference | Source/target compare, canonical/indexability/schema validation | Mark unknown; never fabricate metadata | UNKNOWN |
| M-017 | URL inventory/sitemap/Search Console/crawl | Map old URL/action/target/owner/test | Redirect/SitemapEntry/CanonicalReference | One source action; target relevance; no loop/chain; redirect test | Retain unresolved source row; no generic home redirect | PARTIAL |
| M-018 | WordPress media library | Map all asset metadata and target usages | MediaAsset/MediaVariant/MediaUsage | Count/reference/right/alt/broken-link validation | Quarantine orphan/unlicensed/missing asset | UNKNOWN |
| M-019 | WooCommerce customer/user export | Map identity/contact/address/consent only if migration approved | Customer/CustomerAddress/Consent | Legal/consent/duplicate/identity validation | Do not import; preserve source safely if decision absent | CLIENT DECISION REQUIRED |
| M-020 | WooCommerce order export | Map source order/item/address/status snapshots | Order/OrderItem/OrderAddress/StatusHistory/Note | Count/total/line/status/product/currency reconciliation | Do not expose/migrate without approved finance/legal decision | CLIENT DECISION REQUIRED |
| M-021 | Payment/refund/settlement export | Normalize source transactions/events/refunds/reconciliation | Payment/Attempt/Event/Refund/SettlementRecord | Order linkage/amount/currency/status/reference reconciliation | Hold/manual finance review for mismatch/unknown provider data | CLIENT DECISION REQUIRED |
| M-022 | Shipping/tracking export/provider data | Normalize shipment/service/AWB/label/tracking history | Shipment/Item/Rate/Tracking/Label/Exception/Return | Order linkage/service/AWB/event chronology validation | Hold/manual operations review; no provider assumption | CLIENT DECISION REQUIRED |
| M-023 | Newsletter/channel subscription export | Map only valid consent/preference evidence if approved | CustomerConsent/NotificationPreference | Consent source/channel/identity/dedup validation | Exclude marketing migration without legal approval | CLIENT DECISION REQUIRED |
| M-024 | Staff/admin export if available | Map staff identity/capability only after security review | StaffUser/Role/Permission assignments | Identity/role/least privilege/audit validation | Do not import credentials/roles by inference | CLIENT DECISION REQUIRED |

## 3. Migration status summary

The individual rows intentionally use mixed labels such as `PARTIAL/UNKNOWN` because a source may have a known route/name but unknown required operational fields. The categories below overlap and must not be added together.

| Evidence/gate | Mapping count | Meaning |
|---|---:|---|
| Contains some PARTIAL source evidence | 11 | A known source artifact exists, but export completeness/data validation is missing |
| Contains an UNKNOWN source or target component | 11 | A required source structure, relationship, provider field, or target decision is not confirmed |
| CLIENT DECISION REQUIRED | 6 | Privacy, legal, finance, provider, staff, or business decision gates migration |
| **Total mappings** | **24** | Blueprint mappings; no import readiness implied |

## 4. Validation and failure principles

- Every imported record needs source identity, target identity, transformation result, validation result, error category, owner, and reconciliation status.
- Records with missing critical identifiers/relationships are quarantined, not silently published.
- Financial totals, order snapshots, stock, source/target URL routes, media rights, and customer consent are launch-blocking validation classes.
- Transformations are repeatable/idempotent and have a documented restart/rollback/exception path before execution.
- Import failure must preserve source evidence and report a safe exception; it must not erase source data or create partial authoritative target state.
