# PENA AMEEN SEO Information Architecture and Routing Model

**Phase:** 2 — Information Architecture

**Status:** PROPOSED SEO route governance. Current source robots, sitemap, canonicals, metadata, schema, and full URL inventory are UNKNOWN. This model is therefore a target policy that must be validated, not an assertion about current production behavior.

## 1. SEO IA objective

SEO architecture must make one meaningful, crawlable route available for each eligible PENA AMEEN public content/product purpose and must stop transactional, filtered, duplicate, private, or empty states from competing with those routes.

## 2. Canonical public route classes

| Route class | Canonical candidate | Indexable by default? | Required content/value | Migration sensitivity |
|---|---|---:|---|---|
| Home | `/` | Yes | Brand orientation, useful discovery paths, approved trust/context | Critical |
| Shop | `/shop/` | Yes | Eligible catalog browse entry | Critical |
| Product category | `/product-category/[slug]/` | Yes when retained | Meaningful product list and category context | Critical/High |
| Product | `/product/[slug]/` | Yes when active | Accurate product information and purchasable/availability state | Critical |
| Education hub | `/education/[pillar]/` | Yes when approved | Distinct method education, curated content and relevant product pathways | High |
| Blog | `/blog/` | Yes | Article discovery/archive | High |
| Article | `/[article-slug]/` | Yes when published/retained | Full meaningful editorial content | High |
| Retained content category | `/category/[slug]/` | Conditional | Enough distinct articles/topic purpose | High/Medium |
| Branch index/detail | `/branches/`, `/branches/[slug]/` | Conditional | Active, accurate local/community information | High local |
| Events/gallery | `/events/*`, `/galeri-kegiatan/` | Conditional | Approved event/gallery content with a durable purpose | Medium |
| Profile/contact/FAQ/legal | Explicit stable path | Yes when public/approved | Organization, help, or policy value | High/Medium |

A canonical candidate is not final until source data, redirect decisions, and client approval confirm it.

## 3. Non-indexable route classes

| Route class | Examples | Why non-indexable | Canonical/handling principle |
|---|---|---|---|
| Cart | `/cart/` | Personal session state, no search landing value | Non-indexable; no content canonical target |
| Checkout | `/checkout/` | Transaction state and private customer input | Non-indexable; no content canonical target |
| Order confirmation | `/order/confirmation/[secure-reference]/` | Private/status-specific outcome | Non-indexable, access-controlled later |
| Tracking lookup/result | `/tracking/*` | Private transaction lookup/status | Non-indexable, access-controlled later |
| Account | `/account/*` | Private customer state | Non-indexable, authorization boundary |
| Admin | `/admin/*` | Internal staff operations | Non-indexable, authorization boundary |
| Search query | `/search/?q=...` | Query-generated and potentially infinite/low-quality combinations | Non-indexable; query not an SEO canonical page |
| Filter/sort states | `/shop/?format=...&sort=...` | Duplicate/faceted list states | Non-indexable; stable base collection retains canonical equity where appropriate |
| Empty/validation/error states | Empty cart, form error, provider failure, access denied | No durable discovery purpose | Not indexed; preserve recovery path |
| Internal previews/drafts | Any unpublished content state | Not public content | Not indexed/publicly exposed |

## 4. Canonicalization rules

### One purpose, one canonical destination

- Home, Shop, a retained category, a product, a pillar hub, a blog archive, an article, a branch, a profile/help page, and a policy page each have one intended canonical route.
- A display/navigation label cannot create a second page. Example: use `/profile/` as the canonical destination even if the label says About.
- Do not publish a root article and a duplicate `/blog/[slug]/` article.
- Do not publish a legacy article category and an education hub as two indexable copies of the same ACM or AL-BARQY aggregate purpose; merge decisions require source review.
- Do not create a product-category ACM route merely because ACM has a content hub/product family classification.

### Trailing slashes and route normalization

The intended public canonical convention is trailing slash. Exact host, protocol, casing, encoded character, and HTTP normalization are technical/launch decisions but must converge on the canonical path and redirect test matrix.

## 5. Faceted navigation, filters, and sorting

### Principle

Filters solve a shopper task; they are not automatically SEO landing pages.

| Facet/state | Default route behavior | SEO treatment | Condition to become indexable |
|---|---|---|---|
| Product category | Stable route | Indexable if retained | Clear category purpose, content, eligible products, approved metadata |
| Product method/format/availability/price | Query/filter state | Non-indexable | Separate approved category/landing-page decision with sufficient content and migration review |
| Sorting | Query state | Non-indexable; do not create duplicate product archive | Never by default |
| Search query | Query state | Non-indexable | Never by default |
| Pagination | List state | Page one uses base canonical; deeper-page treatment must preserve discovery without duplication | Review based on catalog/content size and crawl data |
| Product tag | Legacy/archive state | Conditional; noindex/merge/redirect by default | Distinct non-duplicative purpose, source value, owner, content, client/SEO approval |
| Content tag | Legacy/archive state | Conditional; noindex/merge/redirect by default | Same admission test as product tag |

### Pagination policy

- The first page is the base collection route.
- Deeper pages must have a consistent, self-identifying pagination state and must not canonicalize to page one if they expose different products/articles needed for crawl/discovery.
- Whether deeper pages are indexable is an SEO/content-volume decision, not a blanket rule made without catalog/article data.
- Pagination must not create an empty or duplicate page chain.

## 6. Categories, tags, hubs, archives, and duplication control

| Potential duplication | Prevention rule |
|---|---|
| AL-BARQY product category vs education hub | Different purpose: category is product browse; hub is method education/curation. Do not clone each other’s content or use the same title/metadata. |
| ACM content category/tag vs education hub | Proposed merge to one ACM hub after source equivalence review; do not keep parallel indexable archive/hub copies by default. |
| Source article categories vs article tags | Preserve each source route in mapping, but retain only a route with a distinct purpose and meaningful content. |
| Product category vs product tag | Tag cannot restate the category/format/method merely to create an archive. |
| Root article vs `/blog/[slug]/` | Preserve one root article canonical; no parallel blog detail route. |
| Profile vs About | Use one `/profile/` canonical target; label may change. |
| Gallery vs community route | Do not create an additional community archive unless a separate content decision establishes it. |
| Branch root URL vs `/branches/[slug]/` | Use direct relevant redirect after active-data/SEO approval; do not retain both as canonical copies. |
| Filter/sort/query URLs vs collection pages | Non-indexable state routes; stable category/shop retains canonical purpose. |

## 7. Sitemap and crawl model

### Include only eligible canonical public routes

The target sitemap must include only approved, indexable canonical routes, potentially:

- home;
- active products;
- retained product categories;
- education hubs;
- blog and retained articles/categories;
- active approved branch pages;
- approved event/gallery/profile/contact/FAQ/legal pages.

### Exclude

- cart, checkout, order, tracking, account, admin;
- search/filter/sort/query URLs;
- draft/private/preview/empty archives;
- duplicate routes, redirect sources, noindex tags/author archives;
- inactive/unapproved branches/events/testimonials/media-only placeholders.

The source sitemap/robots state is unknown. Source-to-target comparison and Search Console validation remain required.

## 8. Internal linking requirements

Every indexable route must be reachable through at least one meaningful non-search path:

| Route type | Required internal discovery paths |
|---|---|
| Product | Shop/category/search and, where appropriate, education/article links |
| Product category | Shop, footer/contextual category paths, source redirect paths |
| Education hub | Education navigation, related articles, home/contextual links |
| Article | Blog/category/hub/contextual links and source redirect path |
| Branch | Branch index, contextual community/help paths, legacy redirect where applicable |
| Profile/contact/FAQ/legal | Header/footer/help/checkout context as appropriate |

Search, XML sitemap, and direct links supplement but do not replace intentional internal discovery.

## 9. Migration/routing controls

- A redirect source must resolve directly to a relevant target; never default to home.
- A source route marked `UNKNOWN` stays unknown until source verification.
- A changed high-priority product/category/article/branch route requires permanent redirect validation, metadata/content comparison, internal-link update, sitemap decision, and post-launch monitoring.
- Canonical tags cannot replace a required redirect, and redirects cannot replace an indexability/content decision.
- Existing source SEO metadata/schema must be collected before target changes are approved.

## 10. Open SEO decisions

- Full source canonical/robots/sitemap/metadata/schema inventory and redirect matrix (`CDR-006`, `CDR-007`).
- Which legacy content categories/tags/author archives remain public (`CDR-022`).
- AL-BARQY/ACM category/tag merges into hubs (`CDR-027`).
- Gallery/events/branches contents and retention (`CDR-014`, `CDR-015`).
- Pagination indexability thresholds once content/catalog volume is known.
- Search Console, analytics, consent, monitoring, and target metrics (`CDR-018`).
