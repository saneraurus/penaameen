# PENA AMEEN Data Import Contract

**Phase:** 4 — Data Architecture

**Status:** Eventual import contract blueprint. It does not request impossible files as a precondition for unrelated scope, does not import data, and does not prescribe CSV tooling, database tables, or encoding implementation.

## 1. Contract principles

- Source exports are accepted only for approved migration scope.
- A file is required only when its target domain is approved for migration or launch operation.
- Each row needs a stable source identifier or documented composite match strategy; names alone are not reliable identity.
- UTF-8 without ambiguous encoding is the preferred exchange expectation; alternate encoding requires documented conversion/validation.
- Duplicate, missing, invalid, or unmapped data is quarantined with error report/owner rather than silently imported.
- Headers/file shape can be adapted from source exports, but required semantic fields cannot be fabricated.

## 2. Logical file contracts

| File / logical extract | Purpose and scope | Required semantic columns | Optional columns | Unique identifier | Relationship keys | Validation / duplicate / missing handling | Approval requirement |
|---|---|---|---|---|---|---|---|
| `products.csv` | Active/retained product migration | source_product_id, name, slug/URL, status, product_type where known | description, short_description, price, sale_price, dates, SEO fields | source_product_id | category/tag/SKU/media keys | Duplicate source ID/slug BLOCKER; missing name/status ERROR; missing commercial/media data blocks publish | Required for catalog migration |
| `variants.csv` | Variant migration if source confirms variants | source_variant_id, source_product_id, status | SKU, option values, price, stock, image | source_variant_id | source_product_id, SKU, media | Parent missing BLOCKER; duplicates ERROR; absent file acceptable if variants not confirmed | Required only if variants exist/approved |
| `packages.csv` | Package/bundle composition if used | source_package_id or parent ID, component source ID, quantity, status | display/order/version | parent + component + version | product/variant/SKU keys | Missing component/quantity BLOCKER; no inferred composition | Required only if package data exists/approved |
| `skus.csv` | Stable sellable identifier/reconciliation | source_sku or source_subject_id, SKU, status | barcode/warehouse info | normalized SKU or source subject ID | product/variant, inventory | Duplicate SKU BLOCKER; missing SKU blocks inventory/order mapping where SKU required | Required for inventory/fulfillment launch |
| `categories.csv` | Product/content taxonomy migration | source_category_id, scope, name, slug/URL, status | description, parent, SEO fields | source_category_id | product/article assignment IDs | Duplicate slug/scope ERROR; parent/route mismatch ERROR; unknown archive treatment blocked | Required for retained taxonomy |
| `tags.csv` | Tag migration/review | source_tag_id, scope, name, slug/URL, status | description, SEO data | source_tag_id | product/article assignment IDs | Duplicate/meaningless/unknown public tag WARNING/BLOCKER for indexable archive | Required only for approved tag treatment |
| `product_categories.csv` | Product-to-category assignment | source_product_id, source_category_id | order/featured status | composite source IDs | products/categories | Missing target BLOCKER; duplicate assignment deduplicated with report | Required when categories migrate |
| `product_tags.csv` | Product-to-tag assignment | source_product_id, source_tag_id | order/status | composite source IDs | products/tags | Missing target BLOCKER; unresolved public tag held | Required only for approved tags |
| `inventory.csv` | Initial stock reconciliation | SKU/source subject, on_hand quantity, stock status, source timestamp | location, backorder/threshold data | SKU + location/source record | SKU/location | Invalid/non-numeric/negative quantity ERROR; missing location needs approved default; reconciliation BLOCKER | Required for shippable inventory launch |
| `media.csv` | Media library metadata/provenance | source_media_id, source path/URL, filename, MIME/type, lifecycle/status | checksum, dimensions, alt, caption, rights, attribution | source_media_id or approved checksum/path match | product/article/page/branch/event usages | Missing file/invalid MIME/unknown rights ERROR; duplicate checksum/path report | Required for media migration |
| `product_media.csv` | Product media role/order mapping | source_product_id, source_media_id, role, display_order | alt override/caption | composite source IDs | products/media | Missing asset/product BLOCKER for required image; duplicate role warning | Required for active product imagery |
| `articles.csv` | Article migration | source_article_id, title, slug/URL, body, status, publication date | excerpt, author, modified date, SEO fields | source_article_id | category/tag/media/internal link keys | Duplicate slug/URL BLOCKER; missing body/title ERROR; route mapping required | Required for retained articles |
| `article_categories.csv` | Article category assignment | source_article_id, source_category_id | order/status | composite source IDs | articles/categories | Missing article/category BLOCKER; duplicate assignment report | Required when retained archives/articles migrate |
| `article_tags.csv` | Article tag assignment | source_article_id, source_tag_id | order/status | composite source IDs | articles/tags | Missing references BLOCKER; tag treatment gate | Required only for approved tags |
| `pages.csv` | Page migration | source_page_id, title, slug/URL, body, status | template, menu intent, SEO fields | source_page_id | media/internal link keys | Duplicate URL BLOCKER; body/route validation required | Required for retained pages |
| `branches.csv` | Branch migration if active | source_branch_id, name, status, source URL/route | region, address, contact, map, media, SEO | source_branch_id | branch contacts/location/media | Active status/address/contact missing BLOCKER for public branch | Required only if branches continue |
| `events.csv` | Event migration if continued | source_event_id, title, status, source URL/route | date, location, description, branch, media | source_event_id | branch/media/SEO | Missing date/location/status WARNING/ERROR by public policy; no invented event data | Required only if events continue |
| `seo.csv` | Source SEO metadata export | source target ID/URL, title, canonical/indexability | description, schema, OG, image, sitemap data | source URL + target identity | catalog/content/page/branch target | Conflicting canonical/duplicate target BLOCKER; missing fields remain UNKNOWN | Required for full SEO preservation |
| `redirects.csv` | Legacy URL mapping/redirect validation | source URL, action, target URL or explicit treatment, status | reason, priority, owner, test result | normalized source URL | canonical target/entity | Duplicate source, loop, chain, unresolved target BLOCKER | Required for migration launch |
| `customers.csv` | Customer migration only if approved | source_customer_id, approved identity/contact fields, consent state | addresses, account status, notes | source_customer_id | orders/consent/addresses | Consent/identity duplicate/privacy error BLOCKER; do not import passwords | Client/legal approval required |
| `orders.csv` | Historical order migration only if approved | source_order_id/number, status, timestamps, currency, totals, customer/order address references | coupons, notes, payment/tracking refs | source_order_id | order items/customer/payment/shipment | Duplicate IDs/totals/status mapping errors BLOCKER; finance reconciliation required | Client/legal/finance approval required |
| `order_items.csv` | Historical purchase line migration | source_order_id, source_line_id, name, quantity, unit price, subtotal | product/SKU/variant/discount/tax/shipping allocation | source_line_id or composite key | order/product/SKU | Missing order/invalid totals BLOCKER; preserve snapshot even if product absent | Required only with order migration |
| `payments.csv` | Historical payment/refund/settlement migration | source payment ID, source order ID, amount/currency/status/time | provider ref, refund/settlement data | source payment ID | orders/refunds/settlements | Amount/order/status mismatch BLOCKER; provider mapping/finance review | Client/finance approval required |
| `shipments.csv` | Historical shipping/tracking migration | source shipment ID, source order ID, status | service, cost, AWB, label ref, tracking refs | source shipment ID | orders/items/tracking | Missing order/AWB chronology error; provider mapping needed | Client/operations approval required |
| `notifications.csv` | Existing customer notification/preference migration if approved | source event/preference ID, customer/guest key, channel, status/consent | delivery history/template ref | source ID | customer/order/consent | Missing consent/channel policy BLOCKER for marketing; transactional history review | Client/legal approval required |
| `staff.csv` | Staff identity/capability migration if approved | source staff ID, identity reference, status | role/capability mapping | source staff ID | role assignments | No credential/password import; role mapping requires security review | Client/security approval required |

## 3. File-level handling rules

- File manifest records source, export date, checksum/version, encoding, delimiter, header version, owner, approval status, and import run correlation.
- Missing optional fields are recorded as null/unknown with validation status; no substitute values are invented.
- Missing required semantic fields block only the affected entity/publication/feature or whole import where integrity requires it.
- Duplicate handling uses normalized source ID/URL/SKU/composite relationship key and produces a review report; no silent last-write-wins behavior.
- Relationship records import only after parent target mappings are validated.
- Every import run is dry-run/validation-capable before any target write is approved in later phases.
