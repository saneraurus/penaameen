# Migration Data Model — Data Contract

This is a migration data contract, not a database schema. It defines data that must be collected, validated, transformed, and migrated later.

## PRODUCT
- Existing source: WooCommerce-style `/product/*` pages; required source is WooCommerce product export.
- Required fields: source ID, slug, URL, name, status, type, SKU, regular price, sale price, category IDs, primary image, description, short description.
- Optional fields: related products, upsells, cross-sells, reviews, badges, featured flag.
- Unknown fields: complete count, all SKUs, stock, images, canonical URLs, schema, status.
- Transformation requirements: preserve slug or map 301; normalize IDR prices; map WooCommerce product types to new platform product types.
- Migration risk: CRITICAL if products, prices, slugs, or images are lost.
- Validation requirements: compare source/export counts; verify URLs, prices, images, category membership, indexability, and product schema.

## PRODUCT VARIANT
- Existing source: UNKNOWN; possible WooCommerce variable products.
- Required fields: parent product, variant ID, SKU, option names/values, price, stock, image, status.
- Optional fields: dimensions, weight, sale schedule.
- Unknown fields: whether variants exist.
- Transformation requirements: map WooCommerce variations to target variant model only after export confirms them.
- Migration risk: HIGH if bundle/variant pricing or fulfillment differs.
- Validation requirements: source-to-target variant count and purchasability checks.

## CATEGORY
- Existing source: `/product-category/*` and WordPress product category taxonomy.
- Required fields: source ID, slug, URL, name, parent, description, product count, indexability.
- Optional fields: thumbnail, display order, SEO metadata.
- Unknown fields: full category list, descriptions, metadata.
- Transformation requirements: preserve URLs or redirect; separate product-type/method facets later without deleting old archives.
- Migration risk: CRITICAL for indexed category URLs.
- Validation requirements: product counts, URL status, metadata, redirect behavior.

## TAG
- Existing source: `/product-tag/*`, `/tag/*` archives.
- Required fields: source ID, slug, URL, name, taxonomy type, item count.
- Optional fields: description, SEO metadata.
- Unknown fields: full tag list and canonical URLs.
- Transformation requirements: keep, merge, or redirect with explicit decision per tag.
- Migration risk: MEDIUM to HIGH depending on indexation.
- Validation requirements: no indexed tag archive abandoned without decision.

## PRODUCT IMAGE
- Existing source: WooCommerce product media and WordPress media library.
- Required fields: source media ID, file URL, product ID, role, alt text, filename, MIME type.
- Optional fields: caption, title, dimensions, focal point, gallery order.
- Unknown fields: complete media library, alt text, ownership.
- Transformation requirements: download/export originals, preserve filenames where useful, regenerate responsive variants.
- Migration risk: CRITICAL for product trust/conversion and image SEO.
- Validation requirements: every active product has required images and non-broken media URLs.

## INVENTORY
- Existing source: WooCommerce stock fields and warehouse records.
- Required fields: SKU/product ID, stock quantity, stock status, tracking enabled, backorder rules.
- Optional fields: threshold, warehouse location, restock date.
- Unknown fields: all stock quantities and rules.
- Transformation requirements: align with target fulfillment process before launch.
- Migration risk: CRITICAL due overselling/underselling.
- Validation requirements: inventory reconciliation signed off by operations.

## ARTICLE
- Existing source: WordPress posts and `/category/*`, `/tag/*`, `/author/*` archives.
- Required fields: source ID, slug, URL, title, body, excerpt, status, author, published date, modified date, categories.
- Optional fields: tags, featured image, comments, related products, internal links.
- Unknown fields: complete article count, full bodies, metadata.
- Transformation requirements: preserve slug or redirect; convert WordPress formatting/media; retain dates and authors where possible.
- Migration risk: HIGH for AL-BARQY/ACM topical SEO.
- Validation requirements: article count, URL map, body/media rendering, metadata.

## ARTICLE CATEGORY
- Existing source: WordPress category archives.
- Required fields: source ID, slug, URL, name, parent, post count.
- Optional fields: description, SEO metadata.
- Unknown fields: exact unique post counts due overlapping categories.
- Transformation requirements: map to content taxonomy; decide keep/merge/redirect.
- Migration risk: HIGH for indexed archives.
- Validation requirements: category URL and post membership checks.

## PAGE
- Existing source: WordPress pages such as homepage, Profile, Gallery, Branch, Blog, Events, Shop.
- Required fields: source ID, slug, URL, title, body, status, template, menu placement.
- Optional fields: featured image, custom fields, forms, embedded maps/galleries.
- Unknown fields: complete page list and custom fields.
- Transformation requirements: preserve indexed pages; map menu hierarchy; replace shortcodes safely.
- Migration risk: HIGH for navigation and SEO.
- Validation requirements: page inventory reconciliation and no broken menu links.

## MEDIA
- Existing source: WordPress media library.
- Required fields: source ID, file URL/path, filename, MIME type, attached entity, alt text.
- Optional fields: captions, copyright/source, dimensions, thumbnails.
- Unknown fields: complete set, ownership, captions, alt text.
- Transformation requirements: export originals, dedupe, map references from products/articles/pages.
- Migration risk: HIGH.
- Validation requirements: media reference audit and broken-image scan.

## BRANCH
- Existing source: branch pages and client branch directory.
- Required fields: branch name, region, URL, address, contact, status.
- Optional fields: map coordinates, partner name, social links, service area, photos.
- Unknown fields: complete branch list, addresses, maps, partner status.
- Transformation requirements: preserve regional URLs; normalize local SEO fields.
- Migration risk: HIGH for local SEO and community trust.
- Validation requirements: client sign-off on every branch record.

## TESTIMONIAL
- Existing source: homepage snippets and client marketing source.
- Required fields: quote, name/display name, permission status, source page, status.
- Optional fields: photo, role/location, date, related product/program.
- Unknown fields: full testimonial list and permissions.
- Transformation requirements: migrate only permitted testimonials; avoid unverifiable claims.
- Migration risk: MEDIUM.
- Validation requirements: legal/client approval.

## EVENT
- Existing source: `/events/`, gallery/activity content, WordPress posts/pages.
- Required fields: title, URL, date, location, description, status.
- Optional fields: gallery, registration link, related branch, organizer.
- Unknown fields: complete event list and dates.
- Transformation requirements: classify past vs upcoming; keep SEO-value event pages or archive.
- Migration risk: MEDIUM.
- Validation requirements: event inventory reviewed by client.

## REDIRECT
- Existing source: URL inventory, sitemap, search index, crawl/export.
- Required fields: old URL, new URL, redirect type, page type, priority, reason, owner, status.
- Optional fields: traffic/backlinks, last crawled, notes.
- Unknown fields: complete source URL universe.
- Transformation requirements: default 301 for permanent migrations; no indexed URL abandoned without decision.
- Migration risk: CRITICAL.
- Validation requirements: automated redirect test and 404 monitoring.

## SEO METADATA
- Existing source: raw HTML, SEO plugin export, WordPress/WooCommerce metadata.
- Required fields: URL, title, meta description, canonical, indexability, schema type, sitemap inclusion.
- Optional fields: OG/Twitter, focus keyword, image metadata, breadcrumb schema.
- Unknown fields: most metadata due 403 limitation.
- Transformation requirements: preserve high-value metadata; improve only after inventory exists.
- Migration risk: CRITICAL.
- Validation requirements: crawl target site pre-launch and compare source/target SEO fields.

## CUSTOMER
- Existing source: WooCommerce customers/users, if migration approved.
- Required fields: source customer ID, name, email, phone, billing/shipping address, consent flags.
- Optional fields: order history link, account status, notes.
- Unknown fields: whether to migrate customer accounts.
- Transformation requirements: privacy-safe export/import; do not request passwords in plain text.
- Migration risk: HIGH legal/privacy risk.
- Validation requirements: consent/legal review and sample import validation.

## ORDER
- Existing source: WooCommerce orders, if migration approved.
- Required fields: source order ID/number, customer, status, totals, dates, billing/shipping address, line items.
- Optional fields: coupons, notes, refunds, tracking, payment transaction ID.
- Unknown fields: whether historical orders migrate.
- Transformation requirements: preserve historical data if required; avoid affecting accounting.
- Migration risk: HIGH.
- Validation requirements: financial totals and status reconciliation.

## ORDER ITEM
- Existing source: WooCommerce order line items.
- Required fields: order ID, product/SKU, name at purchase, quantity, unit price, totals, tax/discount if any.
- Optional fields: variation/options, fulfillment status.
- Unknown fields: complete historical order item structure.
- Transformation requirements: preserve purchased names/prices even if products changed later.
- Migration risk: HIGH.
- Validation requirements: totals equal order source totals.

## PAYMENT
- Existing source: payment gateway dashboard and WooCommerce payment metadata.
- Required fields: provider, method, transaction ID, amount, status, order ID, timestamps.
- Optional fields: fees, settlement date, refund IDs.
- Unknown fields: provider, methods, webhook mapping.
- Transformation requirements: map statuses to target order/payment states.
- Migration risk: CRITICAL for launch commerce.
- Validation requirements: sandbox/live payment tests and status reconciliation.

## SHIPMENT
- Existing source: shipping provider/aggregator and WooCommerce order shipping data.
- Required fields: provider, courier, service, origin, destination, package weight/dimensions, cost, tracking/AWB, label URL, status.
- Optional fields: pickup schedule, insurance, cancellation/return reason.
- Unknown fields: provider, couriers, AWB/label support, rules.
- Transformation requirements: map rate/shipment/tracking lifecycle to target platform.
- Migration risk: CRITICAL for fulfillment.
- Validation requirements: rate, AWB, label, tracking, cancellation, return tests.
