# PENA AMEEN SEO Technical Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED SEO-first technical design aligned to the Phase 2 route inventory. Source sitemap, robots, canonical tags, metadata, schema, image metadata, and complete URL inventory remain incomplete; no legacy URL is silently discarded by this architecture.

## 1. Route classification

| Route group | Count | Indexability | Rendering/canonical architecture |
|---|---:|---|---|
| Public customer-visible patterns | 31 | Indexable only where public content/product/archive is approved | Server-rendered canonical HTML; metadata/structured data/internal links from authoritative content/SEO state |
| Crawler/system patterns | 2 | Not content-indexable | Server-generated `/sitemap.xml` and `/robots.txt` from approved SEO policy |
| Account patterns | 8 | Non-indexable | Private session/ownership route; no shared cache or public metadata |
| Admin patterns | 24 | Non-indexable | Staff-capability route; no sitemap/public discovery |
| Query/filter/search state | Not standalone route count | Non-indexable by default | Canonical/indexability controlled by stable base route policy |

## 2. Rendering strategy

### Indexable public content

Use server rendering for all approved indexable public routes. Where content is stable, caching/revalidation may be used; where data can change, route generation must revalidate from authoritative state.

| Route family | Rendering target | Cache/revalidation note |
|---|---|---|
| Home, Shop, product category, product | SSR/SSG-capable server rendering with validated product/publication state | Product price/availability must be rechecked before transaction; public cache cannot become purchase authority |
| Education hubs, Blog, Article, Profile, Branch, approved Event/Gallery/FAQ/Legal | Server-rendered content and SEO metadata | Revalidate on published content/media/SEO/redirect change |
| Sitemap/robots | Server-generated system document | Rebuild when route/indexability/redirect state changes |
| Cart/Checkout/Order/Tracking/Account/Admin/Search query | Server-rendered or route response as task requires | Private/noindex/no shared cache; no SEO route generation |

## 3. Metadata architecture

Each indexable entity/route can own validated SEO metadata:

- page title and meta description;
- canonical URL intent;
- robots/indexability intent;
- Open Graph/social title, description, image, URL, type;
- structured-data inputs where valid;
- image alt/caption/context;
- breadcrumbs/internal-link context;
- sitemap eligibility;
- source/migration provenance where applicable.

Metadata defaults must be explicit and safe. A generic template cannot overwrite collected legacy high-value metadata without source/SEO review.

## 4. Canonical and duplicate prevention

| Duplication risk | Technical architecture control |
|---|---|
| Root article and duplicate Blog detail path | Resolve one canonical root article route; do not generate `/blog/[slug]/` duplicate. |
| Profile and About labels | Route label maps to `/profile/`; no duplicate `/about/` page. |
| Product category alternatives | Use retained `/product-category/[slug]/`; do not generate parallel `/shop/[category]/` path. |
| AL-BARQY/ACM category/tag/hub overlap | Publish one approved canonical hub/archive purpose; legacy merge only after source/content equivalence review. |
| Filter/sort parameters | Treat as non-indexable query state; stable Shop/category remains SEO destination. |
| Search queries | Non-indexable; search result has no separate SEO landing identity. |
| Pagination | Page one is base; deeper pages use consistent distinct pagination treatment rather than canonicalizing different product/article subsets to page one. |
| Tags/authors | Noindex/merge/redirect by default until distinct public archive purpose is approved. |
| Branch root and new branch path | Direct relevant redirect after active-data and SEO approval; do not leave parallel canonical copies. |
| HTTP/host/trailing slash variants | Deployment layer normalizes to logical canonical route; exact mechanism validated later. |

## 5. Indexability policy

### Indexable when approved and meaningful

- Home;
- active products;
- retained product categories;
- Education and approved AL-BARQY/ACM hubs;
- Blog and published retained articles;
- approved retained content categories;
- active accurate branch pages;
- approved Profile, Contact, FAQ, legal, Events, Gallery pages as applicable.

### Non-indexable

- Cart, checkout, payment/order outcome, tracking entry/results;
- account and admin routes;
- search query/filter/sort/temporary state;
- drafts/previews/private/unpublished products/content;
- redirects, empty/thin unapproved archives, noindex tags/authors;
- error/validation/access states.

## 6. Structured data architecture

Potential structured-data types are generated only from valid approved data:

| Entity/route | Candidate type | Gate |
|---|---|---|
| Home/Profile | Organization/WebSite | Verified organization details/claims |
| Product | Product/Offer/Breadcrumb | Accurate product, price, availability, image data; source schema unknown |
| Product category/Shop | Breadcrumb/CollectionPage where valid | Retained meaningful category/list |
| Article | Article/Breadcrumb | Published title/date/author/image/content data |
| FAQ | FAQPage only where visible approved questions/answers satisfy policy | FAQ content approval |
| Branch | LocalBusiness/Breadcrumb only where address/contact/status data is verified | Branch source/client approval |
| Event | Event only where date/location/status/organizer data is verified | Event inventory/approval |

Do not create ratings, reviews, offers, delivery promises, organization claims, local data, FAQs, or event details that the source/client cannot substantiate.

## 7. Open Graph and image architecture

- Generate social metadata from approved page/product/content fields and valid media assets.
- Use media metadata/rights/alt text from the Media architecture.
- Do not reuse unknown-rights source image or generate a misleading social preview.
- Different content identities receive their own canonical social URL, not a generic home URL.

## 8. Sitemap and robots architecture

### Sitemap

The sitemap is generated from approved canonical, indexable entities and route rules. It excludes private, query, redirect, draft, empty/thin, account, cart, checkout, tracking, admin, and noindex routes. It must support validation against source URL inventory and redirect matrix before launch.

### Robots

Robots policy is generated/managed separately from canonical/indexability. It cannot hide a required redirect or replace a source URL decision. Current source robots policy is unknown and requires crawl/export validation.

## 9. Redirect, 404, and 410 architecture

| Response | Appropriate use | Guardrail |
|---|---|---|
| Direct canonical response | Retained public source/target page | Preserve content identity/metadata where applicable |
| 301 permanent redirect | Approved changed/merged legacy URL with relevant replacement | Test exact source/target; never default unrelated source to home |
| 404 not found | Unknown/no valid target/nonexistent request | Provide helpful public navigation/search; log safely for analysis |
| 410 gone | Only if client/SEO explicitly approves intentional retirement with no relevant replacement | Do not use merely because source content has not yet been exported |

Every known legacy URL remains in `docs/LEGACY-URL-MAPPING.md` until validated. Incomplete source inventory is a critical migration blocker.

## 10. Internal-link and breadcrumb architecture

- Build breadcrumbs from logical IA relationships, not fabricated URL nesting. Root-level article URLs can have Education context without claiming `/education/` is their path parent.
- Maintain content-to-commerce links from `docs/CONTENT-COMMERCE-MAP.md` through published relation data/editorial approval.
- Validate links after migration/redirect changes; broken internal links are SEO and customer-journey failures.
- No orphan indexable page may rely only on sitemap/search to be discoverable.

## 11. SEO observability

Observe route generation failures, sitemap/robots changes, redirect results, 404 categories, canonical/indexability conflicts, stale metadata/media, structured-data validation, internal-link errors, search index freshness, and post-launch Search Console data when access is granted.

## 12. Critical blockers

- Full source URL, sitemap, robots, canonical, metadata, schema, image-alt, and internal-link inventory.
- Client-approved redirect/content treatment for legacy categories/tags/authors/events/gallery/branches.
- Product/content/media export and rights.
- Search Console/analytics/SEO ownership and monitoring access.
- Final public route/taxonomy decisions in the client decision register.

The architecture preserves the decision space but cannot finalize migration execution until those inputs exist.
