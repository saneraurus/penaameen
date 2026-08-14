# PENA AMEEN Content and SEO Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical model for content, education, media, canonical identity, redirects, and sitemap eligibility. Existing source metadata, canonicals, robots, schema, Open Graph, image alt text, and full URL inventory remain incomplete.

## 1. Content-to-SEO principle

A public route is the rendered result of approved content/catalog data plus SEO policy. Content publication, canonical reference, redirect, indexability, media metadata, internal links, and sitemap inclusion are separate but connected data concerns.

```text
Article / Page / Product / Category / EducationHub / Branch / Event / Gallery
→ SeoMetadata + CanonicalReference
→ public route + internal links + structured data inputs
→ SitemapEntry eligibility
→ Redirect mapping for changed legacy route
```

## 2. Core content and SEO entities

| Entity | Purpose | Required logical fields | Relationships | Lifecycle / migration sensitivity |
|---|---|---|---|---|
| Article | Published educational/editorial record | Source ID when known, title, slug/route, body, status, publication metadata | Category/tag assignments, MediaUsage, EducationRelation, SeoMetadata | Source root URL/body/author/date/media/internal links high-risk |
| Page | Standalone Profile/help/legal/community content | Source ID, title, route, body, status | MediaUsage, SeoMetadata, canonical/redirect | Source page/custom-field/legal data incomplete |
| Category | Scoped content/product taxonomy | Scope, name, slug, status, public policy | Assignments, SeoMetadata, canonical/redirect | Category archive/merge/redirect sensitive |
| Tag | Scoped sparse taxonomy | Scope, name, slug, status, indexability policy | Assignments, SeoMetadata, redirect | Tags/author duplication and source inventory unresolved |
| EducationHub | AL-BARQY/ACM pillar aggregation | Canonical key, route, title, status | Resources/relations, media, SEO | Hub/category/tag relationship requires client approval |
| MediaAsset | Asset metadata/rights/alt/storage reference | Asset source, lifecycle, rights, metadata | Usage by all content entities | Media rights and mapping critical |
| SeoMetadata | Route/entity SEO state | Target, title, canonical/indexability, publication state | Media, canonical reference, sitemap | Source metadata unknown; target must preserve/validate |
| Redirect | Old URL treatment | Source path, target/action, status, reason | Canonical target, audit, sitemap impact | Critical legacy mapping; no generic home redirect |
| CanonicalReference | Logical canonical route relation | Source/target route/entity, status, rationale | SeoMetadata, Redirect, SitemapEntry | Current source canonical unknown |
| SitemapEntry | Eligible canonical route candidate | Target route/entity, inclusion/indexability, generation state | SeoMetadata/canonical target | Current source sitemap unknown |

## 3. SEO-critical data fields

| Data element | Target data requirement | Source status |
|---|---|---|
| Existing URL | Source URL/path with discovery/crawl/export provenance | PARTIAL |
| New URL | Approved target canonical route or explicit no-migrate decision | PROPOSED / client gated |
| Redirect | Source, target, action, response intent, reason, owner/status/test | PARTIAL/UNKNOWN |
| Title | Source and target title/version where available | PARTIAL |
| Description | Source and target description/version where available | UNKNOWN |
| Canonical | Source and target canonical reference | UNKNOWN |
| Indexability | Explicit target index/noindex and source status where known | PARTIAL/UNKNOWN |
| Structured data | Entity type/input/version/validation state | UNKNOWN |
| Open Graph | Title/description/image/URL/type inputs | UNKNOWN |
| Image metadata | Media role, alt, caption, rights, dimensions | UNKNOWN |
| Internal links | Source/target relationship inventory and validation state | UNKNOWN |
| Sitemap inclusion | Target eligibility/generation state | UNKNOWN source / PROPOSED target |

## 4. Internal-link data architecture

Internal links should be modeled as approved content relationships or validated route references, not unbounded raw URL strings where possible. The architecture must support:

- Article → EducationHub / Article / ProductCategory / Product relationship;
- EducationHub → Article / Product / Page / Media resource relation;
- Product → ProductCategory / EducationHub / Article / ProductRelation;
- Branch → contact/community/approved content relation;
- Route changes/redirects triggering link validation/remediation;
- link target publication/indexability checks.

Raw imported links still require source URL mapping and migration validation.

## 5. Canonical, redirect, and sitemap rules

- A published public entity can have one active canonical reference at a time; historical/corrective relations are retained for audit.
- A Redirect source is not itself a canonical target and must point to a relevant approved route or explicit retirement outcome.
- SitemapEntry is derived from approved canonical/indexable/public lifecycle state; it excludes private, search, filter, cart, checkout, order, account, admin, redirect, draft, and thin/unapproved archive routes.
- Category/tag/author/hub route data must record archive treatment to prevent duplicate indexable aggregate pages.
- A content/product route retirement requires redirect/archive/410 decision documented with SEO owner/status; no deletion shortcut.

## 6. Migration model

| Source class | Transformation | Target validation | Failure handling |
|---|---|---|---|
| WordPress article/page | Preserve ID/slug/body/date/author/media/taxonomy where approved | Route resolves or redirect maps; body/media/link/metadata compare | Quarantine item; do not publish or discard source URL silently |
| WooCommerce product/category/tag | Preserve source identity/slug/taxonomy/metadata where approved | Active target/category SEO URL and product relation validate | Hold from public catalog or document explicit exclusion/redirect |
| SEO plugin/crawl metadata | Map target fields and provenance | Priority title/description/canonical/indexability/schema compare | Mark missing/unknown; no fabricated replacement claim |
| Legacy URL inventory | Create Redirect/CanonicalReference decision | Source-to-target test, no loop/chain/unrelated home target | Keep unresolved row blocked and monitor 404 after launch |
| Media library | Map MediaAsset/Usage/alt/rights | Asset exists, rights/usage/alt valid, no broken public URL | Quarantine/replace only with approval |

## 7. Unresolved decisions

Full source metadata/schema/robots/sitemap/internal-link inventory, exact redirect list, category/tag/author treatment, AL-BARQY/ACM hub/archive relation, branch/event/gallery continuation, media rights, content ownership, SEO ownership, and Search Console access remain tracked blockers.
