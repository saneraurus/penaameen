# SEO Migration Risk — penaameen.com

## CRITICAL

- Changing product URL slugs under `/product/` without 301 redirects.
- Changing category URL slugs under `/product-category/` without 301 redirects.
- Launching without preserving indexed homepage, article, product, branch, and gallery URLs.
- Losing product prices, descriptions, images, and possible Product schema.

## HIGH

- Losing article body content that supports AL-BARQY and ACM topical relevance.
- Losing branch pages (`Cabang Jawa Tengah`, `Cabang Jawa Timur`) and local SEO signals.
- Missing canonical tags or accidentally setting `noindex` on commerce/content pages.
- Broken internal links from related posts and menus.

## MEDIUM

- Duplicate category/tag archives if future taxonomy changes are not mapped.
- Thin category pages if migrated without descriptions and product lists.
- Missing image alt text and Open Graph previews.

## LOW

- Preserving footer credit text is not a migration blocker, but replacing it should not remove brand footer links.

## URLs requiring migration attention

See `docs/WEBSITE-URL-INVENTORY.md`; all `CRITICAL` and `HIGH` SEO-importance URLs require explicit redirect/content decisions.
