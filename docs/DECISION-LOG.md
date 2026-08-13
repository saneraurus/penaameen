# Decision Log

This log records project-level decisions and known unresolved decision states. Future entries must not contradict higher-precedence source-of-truth documents in `PROJECT.md`.

| ID | Decision | Status | Reason | Date | Source |
|---|---|---|---|---|---|
| D001 | Project is greenfield. | APPROVED | The project is a new target system, not a direct reuse of existing website architecture. | 2026-08-13 | User instruction; discovery documents |
| D002 | Existing website is treated as the source system. | APPROVED | Current content, products, URLs, commerce behavior, and SEO assets must be discovered and migrated safely. | 2026-08-13 | User instruction; `docs/WEBSITE-AUDIT.md` |
| D003 | Migration must preserve SEO equity. | APPROVED | Indexed URLs, product/category/article slugs, metadata, structured data, internal links, media relationships, and redirects are migration-critical. | 2026-08-13 | User instruction; `docs/SEO-MIGRATION-RISK.md`; `docs/SEO-MIGRATION-DATA.md` |
| D004 | Payment provider is currently unknown. | CONFIRMED | Public discovery did not identify the current payment provider or payment settings. | 2026-08-13 | `docs/UNKNOWN-REGISTRY.md`; `docs/COMMERCE-DATA-REQUEST.md` |
| D005 | Shipping provider is currently unknown. | CONFIRMED | Public discovery did not identify shipping provider, supported couriers, origin address, AWB, labels, or tracking rules. | 2026-08-13 | `docs/UNKNOWN-REGISTRY.md`; `docs/COMMERCE-DATA-REQUEST.md` |
| D006 | Existing product inventory is incomplete. | CONFIRMED | Discovery found partial products and possible additional products; full WooCommerce export is required. | 2026-08-13 | `docs/DISCOVERY-GAPS.md`; `docs/PRODUCT-MIGRATION-PLAN.md` |
| D007 | Existing URL inventory is incomplete. | CONFIRMED | Public URL inventory is partial; sitemap, robots, Search Console, and full crawl/export are unresolved. | 2026-08-13 | `docs/DISCOVERY-STATUS.md`; `docs/DISCOVERY-GAPS.md` |
| D008 | Architecture may be designed before migration data is complete, but provider-specific implementation must remain uncommitted. | APPROVED | High-level product planning can begin despite blockers, but payment, shipping, SEO, data, and migration-sensitive behavior require confirmed data before implementation. | 2026-08-13 | User instruction; `PROJECT.md`; `docs/MIGRATION-READINESS.md` |
