# Content Migration Plan

This plan classifies content for future migration. It does not redesign or rewrite content.

## Classification rules

- KEEP: Preserve content and URL if possible.
- REWRITE: Keep topic/URL value, improve copy after client review.
- MERGE: Combine overlapping pages with 301 redirects.
- REDIRECT: Do not migrate content body, but redirect old URL to relevant destination.
- ARCHIVE: Preserve internally or as non-prominent public content if appropriate.
- NEEDS CLIENT DECISION: Public discovery cannot determine treatment.

## Articles

| Content | Current evidence | Proposed treatment | Notes |
|---|---|---|---|
| AL BARQY Metode Mudah dan Cepat dalam Membaca Al Qur'an | Confirmed article URL, dated 31 January 2019 | KEEP | High topical SEO value for AL-BARQY |
| AL BARQY Metode Anti Lupa | Discovered related article | KEEP | Needs full body export |
| Belajar Cepat Mengaji Untuk Anak, Apakah Bisa? | Discovered related article | KEEP | Needs full body export |
| Metode ACM, Inovasi Pengentasan Buta Aksara | Discovered related article | KEEP | Supports ACM positioning |
| Other category posts | Category counts imply more posts | NEEDS CLIENT DECISION | Requires WordPress export and content review |

## Pages

| Content | Current evidence | Proposed treatment | Notes |
|---|---|---|---|
| Homepage | Indexed title observed | REWRITE | Preserve brand terms; future copy can improve hierarchy |
| Profile | URL discovered | REWRITE | Needs full source content |
| Blog archive | High-confidence navigation URL | KEEP | Needed for article discovery |
| Shop archive | High-confidence navigation URL | KEEP | Critical commerce route |
| Events | High-confidence navigation URL | NEEDS CLIENT DECISION | Need event source of truth |
| Galeri Kegiatan | Indexed gallery page | KEEP or REWRITE | Preserve community proof/media |

## Product descriptions

- CONFIRMED: Several product names, prices, and snippets exist.
- PARTIAL: Descriptions/short descriptions are snippets only.
- UNKNOWN: Full descriptions, SKU, images, stock, dimensions, variants, reviews.
- Treatment: KEEP source product descriptions for migration baseline; REWRITE only after full export and client approval.

## Category descriptions

- Product categories `al-barqy`, `flashcard`, `CD`, `Umum`, and tag `ernuwidodo` are discovered.
- Full category descriptions and SEO metadata are UNKNOWN.
- Treatment: KEEP category URLs; NEEDS CLIENT DECISION for taxonomy improvements after export.

## Educational content

- AL-BARQY and ACM content should be KEEP because discovery identifies them as core educational/SEO pillars.
- Parenting/PEACE/community educational content is PARTIAL and requires export review.

## Branch content

- Cabang Jawa Tengah and Cabang Jawa Timur are KEEP if active.
- Branch addresses/contact/maps/status are UNKNOWN and need client confirmation.
- Inactive branch treatment: CLIENT DECISION REQUIRED; prefer REDIRECT or ARCHIVE rather than deletion.

## Event and gallery content

- Gallery content should be KEEP or ARCHIVE after media rights confirmation.
- Events content is UNKNOWN; classify each event as KEEP for evergreen value, ARCHIVE for old event recap, or REDIRECT if merged into community/gallery.

## Testimonials

- Testimonials are visible in snippets, but source/permission is UNKNOWN.
- Treatment: NEEDS CLIENT DECISION and legal/brand approval before reuse.

## Content migration validation

- Confirm full WordPress export count against URL inventory.
- Validate every migrated page body, media reference, title, slug, author, date, category, tag, internal link, and redirect.
