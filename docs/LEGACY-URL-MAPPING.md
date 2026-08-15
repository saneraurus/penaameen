# PENA AMEEN Legacy URL Mapping

**Phase:** 2 — Information Architecture

**Status:** Proposed mapping register for URLs discovered in Phase 0 and Phase 0.5. A discovered URL is **not** asserted to be the source canonical URL, status code, or complete source inventory. This document maps every known exact public URL/pattern from the discovery documents and keeps unknown source utility paths explicitly unknown.

## 1. Mapping rules

- `KEEP` means the proposed target retains the same path and content identity; it still requires source metadata/canonical validation.
- `REDIRECT` means a proposed permanent redirect to a relevant target after client/SEO approval.
- `MERGE` means a proposed permanent redirect to a more complete, equivalent canonical destination after content/SEO review.
- `ARCHIVE` means retain non-prominent content only when approved; no row is archived by default here.
- `CLIENT DECISION REQUIRED` means the source evidence is insufficient to choose a safe target/treatment.
- `UNKNOWN` means the legacy path itself was not confirmed even if source snippets mention the capability.
- No row authorizes an unrelated homepage redirect.

## 2. Known legacy URL map

| Map ID | Legacy URL as discovered | Proposed new URL | Action | Redirect | Reason | SEO priority | Migration status |
|---|---|---|---|---|---|---|---|
| L-001 | `https://penaameen.com/` | `/` | KEEP | None | Preserve root brand/SEO identity | Critical | PROPOSED; source canonical/metadata still unknown |
| L-002 | `https://penaameen.com/profile/` | `/profile/` | KEEP | None | Preserve established profile content route; public label may change to About | High | PROPOSED; source content/metadata required |
| L-003 | `https://penaameen.com/galeri-kegiatan/` | UNKNOWN or `/galeri-kegiatan/` | CLIENT DECISION REQUIRED | UNKNOWN | Gallery continuation, media rights, and content treatment are unresolved | Medium | BLOCKED by CDR-015/016 and media inventory |
| L-004 | `https://penaameen.com/cabang-jawa-tengah/` | `/branches/jawa-tengah/` | REDIRECT | 301 if branch remains active | Normalize future branch detail under Branches while preserving local SEO through direct equivalent target | High local | PROPOSED; active status/address/contact and SEO approval required |
| L-005 | `https://penaameen.com/cabang-jawa-timur/` | `/branches/jawa-timur/` | REDIRECT | 301 if branch remains active | Normalize future branch detail under Branches while preserving local SEO through direct equivalent target | High local | PROPOSED; active status/address/contact and SEO approval required |
| L-006 | `https://penaameen.com/al-barqy-metode-mudah-dan-cepat-dalam-membaca-al-quran/` | `/al-barqy-metode-mudah-dan-cepat-dalam-membaca-al-quran/` | KEEP | None | Preserve high-value root article URL and topical equity | High | PROPOSED; body/media/metadata/internal links needed |
| L-007 | `https://penaameen.com/al-barqy-metode-anti-lupa/` | `/al-barqy-metode-anti-lupa/` | KEEP | None | Preserve discovered related AL-BARQY article URL | High | PROPOSED; body/media/metadata/internal links needed |
| L-008 | `https://penaameen.com/belajar-cepat-mengaji-untuk-anak-apakah-bisa/` | `/belajar-cepat-mengaji-untuk-anak-apakah-bisa/` | KEEP | None | Preserve discovered related AL-BARQY article URL | High | PROPOSED; body/media/metadata/internal links needed |
| L-009 | `https://penaameen.com/metode-acm-inovasi-pengentasan-buta-aksara/` | `/metode-acm-inovasi-pengentasan-buta-aksara/` | KEEP | None | Preserve ACM topical article URL | High | PROPOSED; body/media/metadata/internal links needed |
| L-010 | `https://penaameen.com/product-category/al-barqy/` | `/product-category/al-barqy/` | KEEP | None | Confirmed critical product category with method/product browse purpose | Critical | PROPOSED; category content/membership/metadata required |
| L-011 | `https://penaameen.com/product-category/flashcard/` | `/product-category/flashcard/` | KEEP | None | Preserve indexed legacy format/browse archive pending taxonomy review | High | PROPOSED; catalog/category review required |
| L-012 | `https://penaameen.com/product-category/cd/` | `/product-category/cd/` | KEEP | None | Preserve indexed legacy format/browse archive pending taxonomy review | High | PROPOSED; catalog/category review required |
| L-013 | `https://penaameen.com/product-category/umum/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | General/catch-all category has unresolved purpose and membership | Medium | BLOCKED by catalog/taxonomy/SEO decision |
| L-014 | `https://penaameen.com/product-tag/ernuwidodo/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Tag meaning, membership, and SEO value are not established | Medium | BLOCKED by tag review |
| L-015 | `https://penaameen.com/product/paket-aktivitas-albarqy/` | `/product/paket-aktivitas-albarqy/` | KEEP | None | Preserve critical known product slug | Critical | PROPOSED; catalog/media/SKU/stock/SEO data required |
| L-016 | `https://penaameen.com/product/paket-poster-albarqy/` | `/product/paket-poster-albarqy/` | KEEP | None | Preserve critical known product slug | Critical | PROPOSED; catalog/media/SKU/stock/SEO data required |
| L-017 | `https://penaameen.com/product/paket-buku-cepat-belajar-membaca-anak-latin-acm-4/` | `/product/paket-buku-cepat-belajar-membaca-anak-latin-acm-4/` | KEEP | None | Preserve critical known ACM product slug | Critical | PROPOSED; catalog/media/SKU/stock/SEO data required |
| L-018 | `https://penaameen.com/product/paket-buku-metode-belajar-membaca-acm-3/` | `/product/paket-buku-metode-belajar-membaca-acm-3/` | KEEP | None | Preserve critical known ACM product slug | Critical | PROPOSED; catalog/media/SKU/stock/SEO data required |
| L-019 | `https://penaameen.com/tag/acm/` | `/education/acm/` | MERGE | 301 after source-content equivalence review | Tag overlaps the ACM education pillar and risks duplicate topical archives | Medium | PROPOSED; CDR-022/027 and source tag inventory required |
| L-020 | `https://penaameen.com/blog/` | `/blog/` | KEEP | None | Preserve high-confidence article archive route | High | PROPOSED; article export/metadata/pagination review required |
| L-021 | `https://penaameen.com/events/` | UNKNOWN or `/events/` | CLIENT DECISION REQUIRED | UNKNOWN | Events continuation, source inventory, and archive treatment are unknown | Medium | BLOCKED by CDR-015 |
| L-022 | `https://penaameen.com/shop/` | `/shop/` | KEEP | None | Preserve high-confidence critical Shop archive route | Critical | PROPOSED; catalog/content/metadata validation required |
| L-023 | `https://penaameen.com/author/penaameen/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Public author archive value and attribution model are not confirmed | Medium | BLOCKED by source content/editorial decision |
| L-024 | `https://penaameen.com/category/acm/` | `/education/acm/` | MERGE | 301 after source-content equivalence review | ACM category becomes a richer canonical education hub rather than parallel topical archive | High | PROPOSED; CDR-027 and complete content export required |
| L-025 | `https://penaameen.com/category/al-barqy/` | `/education/al-barqy/` | MERGE | 301 after source-content equivalence review | AL-BARQY category becomes a richer canonical education hub rather than parallel topical archive | High | PROPOSED; CDR-027 and complete content export required |
| L-026 | `https://penaameen.com/category/anak-anak/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Archive has observed count but unknown bodies, overlap, and retained purpose | High | BLOCKED by content export and SEO review |
| L-027 | `https://penaameen.com/category/business/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Archive has observed count but unknown bodies, overlap, and retained purpose | High | BLOCKED by content export and SEO review |
| L-028 | `https://penaameen.com/category/kesehatan/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Archive has observed count but unknown bodies, overlap, and retained purpose | High | BLOCKED by content export and SEO review |
| L-029 | `https://penaameen.com/category/seminar/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Archive has observed count but unknown bodies, overlap, and retained purpose | High | BLOCKED by content export and SEO review |
| L-030 | `https://penaameen.com/category/umum/` | UNKNOWN | CLIENT DECISION REQUIRED | UNKNOWN | Archive has observed count but unknown bodies, overlap, and retained purpose | High | BLOCKED by content export and SEO review |
| L-031 | `/cart/` expected WooCommerce utility route; exact source URL not verified | `/cart/` | UNKNOWN | UNKNOWN | Source snippets expose Cart but discovery did not confirm exact canonical path/indexability | Medium | Source verification required; target is non-indexable |
| L-032 | `/checkout/` expected WooCommerce utility route; exact source URL not verified | `/checkout/` | UNKNOWN | UNKNOWN | Source snippets expose Checkout but discovery did not confirm exact canonical path/indexability | Medium | Source verification required; target is non-indexable |

## 3. Mapping summary

| Action | Count | Meaning |
|---|---:|---|
| KEEP | 15 | Proposed direct path retention for known home/profile/article/product/category/archive routes |
| REDIRECT | 2 | Proposed branch-path normalization only if active branch data is confirmed |
| MERGE | 3 | Proposed ACM/AL-BARQY category/tag consolidation into education hubs, pending equivalence review |
| ARCHIVE | 0 | No archive action is approved yet |
| CLIENT DECISION REQUIRED | 10 | Gallery, events, catch-all category/tag, author, and unreviewed content archives need client/content/SEO choices |
| UNKNOWN | 2 | Cart and Checkout were mentioned but their exact legacy paths were not verified |
| **Total documented entries** | **32** | 30 discovered exact public URLs plus 2 explicitly unverified commerce utility candidates |

## 4. Source-pattern coverage

The Phase 0.75 SEO worksheet also identifies legacy patterns. The exact known URLs above cover the discovered examples; the pattern policy below makes the coverage explicit without pretending an incomplete pattern is a complete URL list.

| Source pattern | Covered map entries | Target policy |
|---|---|---|
| `/` | L-001 | Keep root candidate after source canonical validation. |
| `/product/*` | L-015 to L-018 | Preserve same product slug where active; add every exported product URL to the final matrix. |
| `/product-category/*` | L-010 to L-013 | Retain verified meaningful source category path or document direct relevant treatment. |
| `/product-tag/*` | L-014 | Require per-tag decision; no default new archive. |
| `/blog/` | L-020 | Keep source archive candidate. |
| Root article slugs | L-006 to L-009 | Preserve same root article path where content is retained. |
| `/category/*` | L-024 to L-030 | Merge only equivalent ACM/AL-BARQY archive intent after review; all other discovered categories require individual decision. |
| `/tag/*` | L-019 | Review/merge ACM tag; add any export-discovered tag individually. |
| `/author/*` | L-023 | Require author archive decision; do not create default target. |
| `/branches` source intent / root branch pages | L-004 to L-005 | Direct relevant branch target only if active/accurate. |
| `/events/*` | L-021 | Require event inventory and retention decision. |
| `/galeri-kegiatan/` | L-003 | Require gallery/media treatment decision. |
| `/shop/` | L-022 | Keep critical commerce archive candidate. |
| Cart/checkout utility routes | L-031 to L-032 | Source paths remain unknown until crawl/export; target routes are non-indexable. |

## 5. URLs not added to this map

The current navigation contains labels such as Komunitas and Mitra Cabang, but discovery did not confirm separate canonical URLs for those labels. They are not invented as legacy URLs here. If the source export/crawl reveals them, they must be added before final redirect approval.

Potential product names with unknown product URLs are likewise not added as URL rows. Their product identity/data remains a catalog migration issue, not a fabricated route mapping.

## 6. Required validation before any redirect is implemented

1. Obtain sitemap, Search Console, crawl, WordPress, and WooCommerce URL sources.
2. Confirm source canonical URL, HTTP behavior, indexability, backlinks/landing value, metadata, and content equivalence for every row.
3. Add every newly discovered URL to this register before launch.
4. Confirm active branch/event/gallery/category/tag/author treatment with PENA AMEEN.
5. Test direct content, 301 target relevance, query behavior, trailing slashes, internal links, canonicals, sitemap inclusion, and no-redirect cases.
6. Monitor post-launch 404s and redirect behavior; an unresolved source URL must not silently receive a generic home redirect.
