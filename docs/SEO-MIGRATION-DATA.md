# SEO Migration Data Requirements

No existing indexed URL should be intentionally abandoned without a documented migration decision.

## Required SEO migration table

| Field | Requirement | Current status |
|---|---|---|
| Existing URL | Every indexed/source URL, including products, categories, tags, articles, pages, branches, archives, cart/checkout as applicable | PARTIAL |
| New URL | Target URL or explicit no-migrate decision | UNKNOWN |
| Redirect type | 301, 302, 410, canonical-only, no redirect, or CLIENT DECISION REQUIRED | UNKNOWN |
| Page type | Homepage, product, product category, product tag, article, article category, tag, author, page, branch, event, gallery, commerce utility | PARTIAL |
| Title | Existing title tag and target title | PARTIAL |
| Meta description | Existing and target description | UNKNOWN |
| Canonical | Existing canonical and target canonical | UNKNOWN |
| Indexability | index/noindex, robots rules, sitemap inclusion | UNKNOWN |
| Structured data | Product, Organization, Article, Breadcrumb, FAQ, LocalBusiness if present | UNKNOWN |
| Open Graph | og:title, og:description, og:image, og:url, og:type | UNKNOWN |
| Image metadata | featured/product image, alt text, captions | UNKNOWN |
| Internal links | Source internal links and target replacements | UNKNOWN |
| Sitemap inclusion | Existing and target sitemap membership | UNKNOWN |
| Priority | CRITICAL/HIGH/MEDIUM/LOW | PARTIAL |

## Redirect mapping strategy

1. Build a source URL master list from sitemap, WordPress export, WooCommerce export, Search Console, analytics landing pages, and public index evidence.
2. Classify every URL by page type and migration decision: KEEP, REWRITE, MERGE, REDIRECT, ARCHIVE, or CLIENT DECISION REQUIRED.
3. Prefer preserving high-value product, category, article, branch, and homepage URLs where the target platform can support them.
4. Use permanent 301 redirects for changed/slashed/merged URLs.
5. Never redirect unrelated content to the homepage as a default.
6. Preserve query-independent canonical URLs and normalize trailing slash behavior consistently.
7. Test all redirects before launch and monitor 404s after launch.

## Initial URL mapping worksheet

| Existing URL/pattern | New URL | Redirect type | Page type | Priority | Status |
|---|---|---|---|---|---|
| https://penaameen.com/ | UNKNOWN or same URL | CLIENT DECISION REQUIRED | Homepage | CRITICAL | PARTIAL |
| /product/* | Prefer same slug if feasible | 301 if changed | Product | CRITICAL | PARTIAL |
| /product-category/* | Prefer same slug if feasible | 301 if changed | Product category | CRITICAL/HIGH | PARTIAL |
| /product-tag/* | UNKNOWN | CLIENT DECISION REQUIRED | Product tag | MEDIUM | UNKNOWN |
| /blog/ | UNKNOWN | CLIENT DECISION REQUIRED | Article archive | HIGH | UNKNOWN |
| /category/* | UNKNOWN | CLIENT DECISION REQUIRED | Article category | HIGH | UNKNOWN |
| /tag/* | UNKNOWN | CLIENT DECISION REQUIRED | Article tag | MEDIUM | UNKNOWN |
| /author/penaameen/ | UNKNOWN | CLIENT DECISION REQUIRED | Author archive | MEDIUM | UNKNOWN |
| Article slugs at root | Prefer same slug if feasible | 301 if changed | Article | HIGH | PARTIAL |
| /cabang-jawa-tengah/ | Prefer same URL if branch remains active | 301 if changed | Branch | HIGH | PARTIAL |
| /cabang-jawa-timur/ | Prefer same URL if branch remains active | 301 if changed | Branch | HIGH | PARTIAL |
| /galeri-kegiatan/ | UNKNOWN | CLIENT DECISION REQUIRED | Gallery | MEDIUM | PARTIAL |
| /events/ | UNKNOWN | CLIENT DECISION REQUIRED | Events | MEDIUM | UNKNOWN |
| /shop/ | UNKNOWN | CLIENT DECISION REQUIRED | Shop archive | CRITICAL | UNKNOWN |
| /cart/ and /checkout/ | Target platform equivalents | Usually no SEO redirect needed unless indexed | Commerce utility | MEDIUM | UNKNOWN |

## Validation requirements

- Source and target crawl comparison before launch.
- Redirect test for every old URL.
- Metadata comparison for every CRITICAL/HIGH page.
- Structured data validation for products, articles, organization, breadcrumbs, and branch/local pages where applicable.
- XML sitemap generated and submitted after launch.
- Search Console monitoring for coverage, 404s, redirects, and indexing changes.
