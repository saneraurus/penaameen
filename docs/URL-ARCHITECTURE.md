# PENA AMEEN URL Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED canonical route model. It is a routing and content-identity specification, not a framework/router implementation. Existing source canonical tags are unknown; the proposed mappings must be validated against a complete source crawl/export before launch.

## 1. URL principles

1. Prefer documented legacy routes when retaining them protects SEO and user comprehension.
2. Use one canonical public path per content/entity purpose; do not create parallel “cleaner” paths without a migration need.
3. Use lowercase, hyphenated slugs and trailing slashes for canonical public content paths.
4. Keep stateful, private, query-driven, and operational routes non-indexable.
5. Use route families only where they add meaningful comprehension: product, education, branch, event, account, and admin.
6. Keep legacy root-level article URLs as a deliberate exception because they are established SEO assets.
7. A source URL is not assumed canonical merely because it was discovered. This document states **target canonical candidates**, not unverified source canonicals.

## 2. Public content and commerce routes

| Pattern | Purpose | Indexable? | Canonical treatment | Parent | Example | SEO value | Migration impact |
|---|---|---:|---|---|---|---|---|
| `/` | Home/brand orientation | Yes | Self-canonical | Root | `/` | Critical | Keep source home path; source canonical still verify |
| `/shop/` | All-products storefront | Yes | Self-canonical | Root / Shop | `/shop/` | Critical | Preserve high-confidence legacy Shop route |
| `/product-category/[slug]/` | Retained primary product category archive | Yes when retained | Self-canonical | Shop conceptually | `/product-category/al-barqy/` | Critical/High | Preserve legacy category paths where retained |
| `/product/[slug]/` | Product detail | Yes when active | Self-canonical | Shop/category conceptually | `/product/paket-aktivitas-albarqy/` | Critical | Preserve established product path/slugs where feasible |
| `/product-tag/[slug]/` | Legacy product-tag archive only | Conditional | Noindex/redirect/merge until a distinct archive is approved | Shop conceptually | `/product-tag/ernuwidodo/` | Medium | Do not create new tag canonicals by default |
| `/search/` | Public search entry/results | No | Empty search entry may self-canonical; query result has no indexable canonical destination | Utility | `/search/?q=albarqy` | Low | New service path; no legacy search URL established |
| `/education/` | Education landing and pillar orientation | Yes | Self-canonical | Root / Education | `/education/` | High | New route; links to legacy-mapped content |
| `/education/al-barqy/` | AL-BARQY education hub | Yes when approved | Self-canonical | Education | `/education/al-barqy/` | High | Candidate merge target for legacy content category, not product category |
| `/education/acm/` | ACM education hub | Yes when approved | Self-canonical | Education | `/education/acm/` | High | Candidate merge target for legacy ACM category/tag |
| `/blog/` | Article archive | Yes | Self-canonical | Education conceptually | `/blog/` | High | Preserve high-confidence legacy Blog route |
| `/[article-slug]/` | Individual article | Yes when published/retained | Self-canonical | Blog/Education conceptually | `/al-barqy-metode-anti-lupa/` | High | Preserve root-level legacy article slugs; reserved-slug governance required |
| `/category/[slug]/` | Retained legacy article category archive | Conditional | Self-canonical only if retained; otherwise redirect/merge | Blog conceptually | `/category/anak-anak/` | High/Medium | Source archive treatment varies by category |
| `/tag/[slug]/` | Retained legacy article tag archive | Conditional | Noindex/redirect/merge by default | Blog conceptually | `/tag/acm/` | Medium | Avoid duplicate pillar/tag pages |
| `/author/[slug]/` | Retained author archive | Conditional | Noindex/redirect/merge by default | Blog conceptually | `/author/penaameen/` | Medium | Do not assume author archive future |
| `/branches/` | Branch index | Yes if active branch data is approved | Self-canonical | Root / Branches | `/branches/` | High local | New index; source root branch pages need mapping |
| `/branches/[slug]/` | Branch detail | Yes if active/accurate | Self-canonical | Branches | `/branches/jawa-tengah/` | High local | Proposed target for legacy root branch URLs |
| `/events/` | Events archive | Conditional | Self-canonical only if continued | Branches/community conceptually | `/events/` | Medium | Preserve/map high-confidence legacy route only after decision |
| `/events/[slug]/` | Event detail/recap | Conditional | Self-canonical only if retained | Events | `/events/[slug]/` | Medium | Event source URLs unknown |
| `/galeri-kegiatan/` | Gallery/activity page | Conditional | Self-canonical if retained | Branches/community conceptually | `/galeri-kegiatan/` | Medium | Preserve legacy path or explicit archive/redirect decision |
| `/profile/` | Organization/profile page | Yes if retained | Self-canonical | Root / Profile | `/profile/` | High | Keep route even if public label changes to About |
| `/contact/` | Contact/help route | Yes | Self-canonical | Help | `/contact/` | Medium | New target; source contact route unknown |
| `/faq/` | Approved FAQ route | Yes if approved | Self-canonical | Help | `/faq/` | Medium | New target; source FAQ unknown |
| `/legal/privacy/` | Privacy policy | Yes | Self-canonical | Legal | `/legal/privacy/` | Medium | New target; legal source unknown |
| `/legal/terms/` | Terms and conditions | Yes | Self-canonical | Legal | `/legal/terms/` | Medium | New target; legal source unknown |
| `/legal/shipping/` | Shipping policy | Yes | Self-canonical | Legal | `/legal/shipping/` | Medium | New target; policy source unknown |
| `/legal/returns-refunds/` | Return/refund policy | Yes | Self-canonical | Legal | `/legal/returns-refunds/` | Medium | New target; policy source unknown |
| `/cart/` | Current cart | No | Non-indexable state route | Commerce utility | `/cart/` | None | Expected source path not verified; do not assert legacy canonical |
| `/checkout/` | Current checkout | No | Non-indexable state route | Cart | `/checkout/` | None | Expected source path not verified; do not assert legacy canonical |
| `/order/confirmation/[secure-reference]/` | Order result/pending/recovery | No | Non-indexable private/service route | Checkout | `/order/confirmation/[secure-reference]/` | None | New target; secure reference is conceptual |
| `/tracking/` | Tracking/order lookup entry | No | Non-indexable service route | Utility/Help | `/tracking/` | None | New target; account/lookup policy unresolved |
| `/tracking/[secure-reference]/` | Authorized tracking result | No | Non-indexable private/service route | Tracking | `/tracking/[secure-reference]/` | None | New target; access policy unresolved |

## 3. Account routes

| Pattern | Purpose | Indexable? | Canonical treatment | Parent | Example | SEO value | Migration impact |
|---|---|---:|---|---|---|---|---|
| `/account/` | Authorized account overview | No | Non-indexable private route | Utility | `/account/` | None | New/conditional |
| `/account/login/` | Account entry | No | Non-indexable service route | Account | `/account/login/` | None | New/conditional |
| `/account/register/` | Optional account creation | No | Non-indexable service route | Account | `/account/register/` | None | Client account-policy decision |
| `/account/password-reset/` | Account recovery | No | Non-indexable service route | Account | `/account/password-reset/` | None | Conditional on account mechanism |
| `/account/orders/` | Authorized order history | No | Non-indexable private route | Account | `/account/orders/` | None | Historical migration decision |
| `/account/orders/[order-reference]/` | Authorized order detail | No | Non-indexable private route | Account orders | `/account/orders/[order-reference]/` | None | Access/migration decision |
| `/account/profile/` | Customer profile | No | Non-indexable private route | Account | `/account/profile/` | None | Conditional |
| `/account/addresses/` | Saved address management | No | Non-indexable private route | Account | `/account/addresses/` | None | Optional/conditional |

## 4. Administrative routes

The `/admin/` namespace is internal, authenticated, non-indexable, and separate from all public/account paths. See `docs/ADMIN-IA.md` and `docs/ROUTE-INVENTORY.md` for the complete task hierarchy.

| Pattern family | Purpose | Indexable? | Canonical treatment | Example |
|---|---|---:|---|---|
| `/admin/` | Dashboard/work queues | No | Internal task route | `/admin/` |
| `/admin/products/*` | Product/catalog management | No | Internal task routes | `/admin/products/[id]/` |
| `/admin/orders/*` | Order/payment/shipment operations | No | Internal task routes | `/admin/orders/[id]/` |
| `/admin/content/*` | Content/taxonomy management | No | Internal task routes | `/admin/content/[id]/` |
| `/admin/seo/*` | Metadata/redirect operations | No | Internal task routes | `/admin/seo/redirects/` |
| `/admin/settings/*` | Settings/access management | No | Internal task routes | `/admin/settings/access/` |

## 5. Crawler/system routes

| Pattern | Purpose | Indexable? | Canonical treatment | Migration impact |
|---|---|---:|---|---|
| `/sitemap.xml` | Publish eligible canonical public URLs to crawlers | Not a content page | Generated canonical URL list | Source sitemap unknown; target required before launch |
| `/robots.txt` | Communicate crawl controls | Not a content page | System directive | Source robots unknown; target policy needs SEO review |
| Unmatched public path | Serve not-found/redirect result | No | No indexable canonical | Every known legacy path must be resolved through mapping before this fallback |

## 6. Query parameters, pagination, filters, and normalization

### Canonical normalization

- Canonical content paths use a trailing slash.
- Host/protocol normalization, language variants, and query stripping are implementation/deployment concerns that require later technical/SEO review; this IA only establishes one logical route shape.
- A navigation label does not change a canonical path. `Profile` may be labeled About while `/profile/` remains its target.

### Pagination

- Page one uses the base route (`/shop/`, `/blog/`, retained category route).
- Paginated list state uses a single consistent pagination parameter/pattern selected in later technical work.
- A paginated page must not canonicalize to page one when it contains a distinct subset necessary for discovery.
- Indexability of deep pagination is reviewed with content volume/crawl data; it must not create duplicate titles/content or block product/article discovery.

### Filters and sorting

- Filter, sort, availability, price, and attribute states are query-driven browse states, not new category URLs.
- They are non-indexable by default and point back to the stable base collection for canonical equity where appropriate.
- No indexable SEO landing page is created from a filter combination without a separate approved content/category decision.
- A query cannot create a category, product tag, or product family by implication.

### Search

- Search uses `/search/` with query/scope as state, e.g. `/search/?q=acm&scope=products`.
- Query results are non-indexable. An empty search entry can be a stable utility route; query-specific results do not become canonical SEO pages.
- Search URLs are not a substitute for preserving/mapping legacy category, product, article, or hub URLs.

## 7. Root-slug governance

Root-level articles are preserved because source evidence establishes them. To prevent collision with root pages and legacy destinations:

- reserve known root page slugs such as `profile`, `galeri-kegiatan`, `events`, `shop`, `cart`, `checkout`, `contact`, `faq`, `education`, `branches`, `account`, `tracking`, `legal`, `product`, `product-category`, `product-tag`, `category`, `tag`, and `author`;
- maintain a migration/source route registry before publishing a root-level article slug;
- do not create parallel `/blog/[slug]/` copies of retained root articles;
- resolve a collision through a documented migration/content decision, not an arbitrary suffix.

## 8. Open decisions and validation gates

- Legacy category/tag/author/gallery/event/branch treatment remains governed by `docs/LEGACY-URL-MAPPING.md` and CDRs 006, 014, 015, 022, and 027.
- Product/category/article source canonicals, trailing slash behavior, metadata, robots, and sitemap membership are still unverified.
- Final account/order/tracking privacy boundaries require CDR-008 and later security architecture.
- URL target paths must be validated against the complete source URL inventory, redirect matrix, internal-link replacement plan, and pre-launch crawl before approval.
