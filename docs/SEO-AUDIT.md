# SEO Audit — penaameen.com

## Crawl limitations

Direct `curl`, Python `urllib`, `robots.txt`, sitemap, and homepage fetches from the repository environment failed with `CONNECT tunnel failed, response 403`. Findings below are based on search-index snippets and public result rendering.

## Observed SEO state

- FACT: The homepage is indexed with title `Pena Ameen | Belajar Tanpa Mengenal Usia`.
- FACT: Product, product-category, product-tag, branch, gallery, and article URLs are indexed.
- FACT: URL structure strongly resembles WordPress/WooCommerce: `/product/`, `/product-category/`, `/product-tag/`.
- FACT: Article snippets show category archives and WordPress-style comment forms.
- FACT: Article category counts are visible in sidebars.
- UNKNOWN: robots.txt contents.
- UNKNOWN: sitemap.xml contents.
- UNKNOWN: canonical tags.
- UNKNOWN: meta descriptions.
- UNKNOWN: Open Graph/Twitter metadata.
- UNKNOWN: structured data details.
- UNKNOWN: image alt text and heading hierarchy, except page titles visible in snippets.

## Risks and issues

- INFERENCE: Product/category URLs are SEO assets and should not be casually changed.
- INFERENCE: Mixed category taxonomy may create duplicate/thin archives but also may have existing index equity.
- INFERENCE: If WooCommerce schema exists now, losing Product schema during migration could reduce product-result eligibility.
- RECOMMENDATION: Run a full crawl from an unrestricted network and export WordPress/WooCommerce SEO metadata before any launch.
