# PENA AMEEN SEO Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory SEO and migration-safe implementation rules. Source sitemap, robots, metadata, canonical, schema, and complete URL inventory remain incomplete; no legacy URL may be abandoned by code/design convenience.

## 1. Canonical route rules

- Implement only Phase 2 canonical route candidates and approved redirect treatments.
- Preserve `/shop/`, `/product-category/[slug]/`, `/product/[slug]/`, retained root article paths, `/blog/`, approved education hubs, branch/profile/gallery/event routes according to mapping decisions.
- Do not create duplicate `/about/`, `/blog/[slug]/`, `/shop/[category]/`, unsupported ACM category, or query-driven SEO route.
- A route/slug/archive/redirect change requires SEO owner review, mapping update, tests, audit, and deployment validation.

## 2. Rendering and metadata

- Server-render indexable public content/product/category/hub/article/branch/help routes with canonical metadata input.
- Generate title, description, canonical, robots/indexability, Open Graph, structured data, image metadata, breadcrumbs, and sitemap eligibility only from approved fields.
- Do not fabricate schema, review, rating, offer, branch, FAQ, event, delivery, or claim data.
- Private/cart/checkout/order/tracking/account/admin/query/filter/sort states remain noindex/private/non-canonical as upstream architecture requires.

## 3. Redirect, 404, and 410

- Redirect sources come from approved Redirect/legacy mapping records, not hardcoded scattered rules.
- Use direct relevant permanent redirect only for approved changed/merged routes.
- Never redirect unrelated/missing legacy URL to home by default.
- 404 is safe for unresolved/nonexistent route and includes helpful navigation/search without false content.
- 410 requires explicit client/SEO retirement decision; lack of source export is not enough.
- Validate loops, chains, canonical target, trailing slash/normalization, internal links, sitemap status, and monitoring after deploy.

## 4. Pagination, filters, search, and duplicate control

- Page one remains base collection; deeper page behavior preserves distinct discoverable content under approved SEO policy.
- Filter/sort/query states are bounded/non-indexable unless a separate approved public landing decision exists.
- Search results are non-indexable and link to canonical targets.
- Category/tag/author/hub routes publish only under approved distinct purpose and source/migration treatment.

## 5. Migration and tests

Before launch, compare source/target priority URLs, metadata, canonical/indexability, structured data, media/alt, internal links, redirects, sitemap, robots, 404, and Search Console signals where access exists. No implementation PR affecting public routes merges without this analysis where applicable.
