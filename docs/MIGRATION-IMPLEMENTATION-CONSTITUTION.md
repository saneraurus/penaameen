# PENA AMEEN Migration Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future migration rules. No source export, import, redirect, media transfer, customer/order migration, or production cutover is performed.

## 1. Source preservation

- Treat WordPress/WooCommerce and supplied exports as read-only source evidence unless client explicitly approves a source operation.
- Preserve source IDs, URLs, slugs, metadata, media references, relationships, status, timestamps, and validation provenance where available.
- Do not infer missing source fields or overwrite source/target history to make reconciliation appear clean.

## 2. Import workflow

```text
approved source export
→ manifest/version/checksum/encoding validation
→ staging parse and schema/identifier validation
→ duplicate/reference/domain validation
→ quarantine and error report
→ dry-run reconciliation
→ approved idempotent target import
→ post-import count/value/URL/media/audit validation
→ cutover/rollback monitoring
```

## 3. Mandatory safeguards

- Imports are idempotent and scoped by source mapping/run/correlation.
- Parent/reference mappings validate before dependent relationship import.
- Invalid records quarantine with severity/owner/reason; no silent skip/last-write-wins.
- Customer/order/payment/shipment/consent/staff imports require client/legal/finance/security approval.
- Product/catalog/inventory/content/media/SEO redirect imports require source/target reconciliation and owner sign-off.
- URL preservation/redirect testing, canonical/indexability, metadata, media, internal link, sitemap, and 404 checks are mandatory before launch.
- Backups/rollback/recovery plan is validated before destructive target action; source is never mutated as rollback shortcut.

## 4. Migration testing

Validate source/target counts, IDs, slugs/URLs, taxonomy membership, SKU/inventory, order totals/line snapshots, payment/shipment references, media files/rights/alt, SEO metadata/redirects, consent/privacy, and documented exclusions. Provider-specific historical data remains unmapped until provider/finance/operations decisions authorize it.
