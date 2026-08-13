# Product Migration Plan

This plan maps existing WooCommerce-style product data into the future commerce platform. It does not define database schema or implement commerce.

## Field mapping strategy

| Product data | Target use | Status | Source required |
|---|---|---|---|
| Product identity/source ID | Stable migration key | UNKNOWN | WooCommerce export |
| SKU | Inventory/order/fulfillment key | UNKNOWN | WooCommerce export/warehouse sheet |
| Slug | SEO URL preservation | PARTIAL | Existing URL inventory + export |
| Name | Storefront and order line display | PARTIAL | WooCommerce export |
| Description | Product detail body | PARTIAL | WooCommerce export |
| Short description | Product summary | PARTIAL | WooCommerce export |
| Price | Checkout pricing | PARTIAL | WooCommerce export |
| Sale price | Promotional pricing | PARTIAL | WooCommerce export |
| Category | Browsing and SEO | PARTIAL | WooCommerce export |
| Tags | Discovery/filtering/SEO | PARTIAL | WooCommerce export |
| Images | Product trust/conversion | UNKNOWN | Media export |
| Weight | Shipping rates | UNKNOWN | WooCommerce export/operations sheet |
| Dimensions | Shipping/package rules | UNKNOWN | WooCommerce export/operations sheet |
| Stock | Inventory control | UNKNOWN | WooCommerce export/warehouse sheet |
| Variants | Options and pricing | UNKNOWN | WooCommerce export |
| Related products | Cross-sell/upsell | UNKNOWN | WooCommerce export |
| SEO | Metadata/schema/canonical | UNKNOWN | SEO export/crawl |
| Status | Published/draft/discontinued | UNKNOWN | WooCommerce export/client review |

## Known product migration list

| Product | Current URL | Confirmed data | Partial data | Unknown data | Treatment |
|---|---|---|---|---|---|
| Paket Aktivitas ALBARQY | /product/paket-aktivitas-albarqy/ | Name, URL, price snippet | Category, snippet description | SKU, images, stock, dimensions, variants, SEO | KEEP; verify export |
| Paket Poster ALBARQY | /product/paket-poster-albarqy/ | Name, URL, price snippet | Category, product type | SKU, images, stock, dimensions, variants, SEO | KEEP; verify export |
| Paket Buku Cepat Belajar Membaca Anak ACM 4 | /product/paket-buku-cepat-belajar-membaca-anak-latin-acm-4/ | Name, URL, price snippet | Category/description snippet | SKU, images, stock, dimensions, variants, SEO | KEEP; verify export |
| Paket Buku Metode Belajar Membaca ACM 3 | /product/paket-buku-metode-belajar-membaca-acm-3/ | Name, URL | Description snippet | Price, SKU, images, stock, dimensions, variants, SEO | KEEP; verify export |
| Paket Buku Cepat Belajar Membaca Anak ACM 2 | UNKNOWN | Name | Category/snippet | URL, price, SKU, images, stock, dimensions, variants, SEO | CLIENT DECISION REQUIRED after export |
| PENGANTAR ILMU HUKUM | UNKNOWN | Name, regular/sale price snippet | Category/tag | URL, SKU, images, stock, dimensions, SEO | CLIENT DECISION REQUIRED after export |
| Paket ALBARQY 1 | UNKNOWN | Possible product name | Possible category evidence | URL and all commerce fields | POSSIBLE; verify export |
| Paket FlashCard ALBARQY | UNKNOWN | Possible product name/price | Possible category evidence | URL and all commerce fields | POSSIBLE; verify export |
| Paket Home Learning ALBARQY | UNKNOWN | Possible product name/price | Possible category evidence | URL and all commerce fields | POSSIBLE; verify export |
| Paket Home Learning Buku Belajar Cepat Membaca ACM | UNKNOWN | Possible product name/price | Possible related slug evidence | URL and all commerce fields | POSSIBLE; verify export |

## Transformation requirements

1. Use WooCommerce product ID/SKU as source identity, not only product name.
2. Preserve product slugs for indexed products where feasible.
3. Map categories/tags without collapsing them until SEO decisions are made.
4. Normalize prices as IDR currency values with integer minor-unit handling decided by implementation phase.
5. Preserve sale prices and schedules if present.
6. Map stock status separately from numeric quantity.
7. Preserve product images and alt text; do not reuse unlicensed media.
8. Map package/bundle contents explicitly before launch.
9. Preserve product SEO metadata and structured data if present.

## Validation checklist

- Source product count equals target product count plus documented exclusions.
- Every active product has SKU/client-approved identifier.
- Every active product has correct price/sale price.
- Every shippable product has weight/package rules or explicit default rule.
- Every migrated product URL either resolves directly or redirects correctly.
- Every active product has required images and approved status.
