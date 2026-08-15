# PENA AMEEN Content and SEO Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Product requirements for content and organic discovery. This document does not choose a CMS, SEO tool, schema library, analytics provider, redirect mechanism, or final URL design.

## 1. Product premise

PENA AMEEN’s content, education, community/branch presence, and product catalog form one discovery system.

```text
Useful, accurate content and method education
  → crawlable/indexable, well-linked pages
  → relevant organic/direct/social discovery
  → product/category exploration
  → informed cart and checkout action
  → post-purchase trust and future discovery
```

The purpose is not to turn every article into a sales page. Content should help visitors understand relevant topics, while contextual internal links can lead qualified visitors to appropriate PENA AMEEN products or categories.

## 2. Confirmed evidence and migration constraints

### CONFIRMED

- Existing indexed public assets include the homepage, product/category/tag pages, AL-BARQY and ACM articles, branch pages, and gallery page.
- The current site contains AL-BARQY and ACM educational content, product discovery, branches/community, gallery, events/navigation intent, and WordPress-style article category/tag/author archives.
- Existing valuable URLs must not disappear without a documented migration decision.
- The full URL inventory, sitemap, robots rules, canonical tags, metadata, schema, Open Graph/Twitter data, image alt text, and internal-link graph are incomplete or UNKNOWN because discovery access was limited.

### Migration principle

> Preserve an existing valuable URL directly where feasible. If it changes, merge, retires, or is no longer appropriate, document a specific target/treatment and validate it. Do not default unrelated URLs to the homepage.

See `docs/SEO-MIGRATION-DATA.md`, `docs/SEO-MIGRATION-RISK.md`, and `docs/MIGRATION-CHECKLIST.md`.

## 3. Content and SEO requirements

| Requirement ID | Requirement | Priority | Status | Migration impact / dependency |
|---|---|---|---|---|
| REQ-SEO-001 | Preserve or explicitly map every valuable existing source URL; no source URL is silently dropped. | MUST HAVE | CONFIRMED | Critical; full URL inventory/redirect matrix incomplete |
| REQ-SEO-002 | Support articles, categories, tags, pages, product content, category content, branch/community content, and approved event content. | MUST HAVE | CONFIRMED | Content/taxonomy export incomplete |
| REQ-SEO-003 | Support page-level SEO metadata, canonical URL intent, indexability intent, Open Graph metadata, and valid structured-data inputs. | MUST HAVE | CONFIRMED | Source metadata/schema unknown |
| REQ-SEO-004 | Support purposeful internal links between content, methods, categories, products, branches, and help/policy pages. | MUST HAVE | PROPOSED | Source link graph unknown |
| REQ-SEO-005 | Generate a crawlable sitemap representation from approved public content and maintain appropriate indexability controls. | MUST HAVE | CONFIRMED | Existing sitemap/robots unknown |
| REQ-SEO-006 | Support controlled redirect management and validation for old-to-new URLs. | MUST HAVE | CONFIRMED | Full source URL map and redirect decisions required |
| REQ-SEO-007 | Preserve content/media relationships, title/date/author/category context where relevant and approved. | MUST HAVE | PROPOSED | WordPress/media export incomplete |
| REQ-SEO-008 | Retain AL-BARQY and ACM as core content/product discovery pillars while avoiding unverified claims. | MUST HAVE | CONFIRMED | Full content and approved claims needed |
| REQ-SEO-009 | Support accessible media metadata and image context for product/content discoverability. | SHOULD HAVE | PROPOSED | Media rights/alt/caption inventory unknown |
| REQ-SEO-010 | Decide treatment of legacy archives, events, galleries, testimonials, branches, and old content one URL/content item at a time. | CLIENT DECISION REQUIRED | BLOCKED | Client/content/SEO review and source export |
| REQ-SEO-011 | Do not publish invalid/misleading structured data, canonical signals, or claims merely to obtain rich results. | MUST HAVE | PROPOSED safety requirement | Source/approved content and technical validation |

## 4. Content model capabilities

### 4.1 Articles

Articles must be able to support educational and organic-discovery intent. At a product-requirement level, an article can have:

- title and stable public URL/slug;
- body/content and excerpt/summary where approved;
- publish status and date; author attribution when retained/approved;
- category and tag relationships;
- featured/inline media with accessible metadata;
- related article/method/product links when editorially appropriate;
- SEO metadata, canonical/indexability intent, social metadata, and eligible structured-data inputs;
- migration source identity and old URL mapping where applicable.

Existing observed articles about AL-BARQY and ACM should be treated as high-value migration candidates. The complete article export, full body, metadata, and internal links are UNKNOWN.

### 4.2 Content categories and tags

The product must support content categories and tags because source WordPress archives and categories are discovered. It must not automatically expose or index every taxonomy term without a content/SEO decision.

Requirements:

- preserve taxonomy identity/relationships during migration analysis;
- provide archive/page treatment where a taxonomy is retained;
- support description and SEO context for retained archive pages;
- allow a documented keep/merge/redirect/archive decision per source archive;
- avoid creating empty, duplicate, or thin pages as an accidental by-product of migration.

Current discovered article categories include ACM, Al-Barqy, Anak-Anak, Business, Kesehatan, Seminar, and Umum. Their full membership, canonical state, indexability, and hierarchy are UNKNOWN.

### 4.3 Pages

The content system must support durable pages for approved brand, education, community, branch, contact, FAQ, and legal/policy content. Existing Profile, Gallery, Branch, Blog, Shop, and Events intent must be mapped through the migration process.

A page needs a clear purpose, stable treatment, content/status, relevant media, internal links, SEO controls, and a migration decision where a source URL exists.

### 4.4 Product and category content

Products and categories are content as well as transactional records. The product model must support approved descriptions, images, package/use context, SEO metadata, and related content/product links. Category pages need meaningful context rather than bare grids when source/approved content supports it.

The product catalog must not invent descriptions, ratings, claims, stock, product composition, or use cases. Full descriptions and product media are migration dependencies.

### 4.5 Branches, galleries, events, and testimonials

- **Branches:** Retain approved active branch context and local SEO fields when the source of truth is supplied. Two branch pages are confirmed; complete list and information are UNKNOWN.
- **Gallery:** Preserve approved media/community proof only after media rights and treatment are known.
- **Events:** Event inventory/strategy is UNKNOWN; active event, past recap/archive, merge, or redirect treatment is a client decision.
- **Testimonials:** Existing snippets show testimonial/social-proof evidence, but source and permissions are UNKNOWN. Reuse requires approval and must avoid unsupported claims.

## 5. Metadata and discoverability requirements

### 5.1 Page-level metadata

Every eligible public page/content/product/category record needs an approved way to hold and validate:

| Field | Requirement |
|---|---|
| Title | Unique, accurate page title informed by approved content and source preservation where relevant. |
| Meta description | Accurate summary where desired; source values must be collected before replacement. |
| Canonical URL | A clear canonical intent; no assumed route pattern or duplicate strategy. |
| Indexability | Explicit public indexing intent, including noindex for non-discovery transactional/private pages where appropriate. |
| Open Graph/social metadata | Accurate title, description, URL, type, and approved image where relevant. |
| Structured data inputs | Valid entity-specific inputs only when claims/data are present and schema is appropriate. |
| Image metadata | Alt text/caption/context where relevant and supplied/approved. |
| Sitemap inclusion | Determined by public/indexability/content state and migration/SEO policy. |

The precise fields, defaults, validation, and generated output are not a CMS or technical implementation decision.

### 5.2 Canonical and indexability principles

- Canonical URLs must represent deliberate content identity, not hide an unresolved duplicate/taxonomy problem.
- Cart, checkout, customer account, order confirmation, and other private/transactional states should not be treated as public SEO landing pages; final robots/indexability behavior requires technical/SEO review.
- Legacy category/tag/author/archive decisions must not be guessed from navigation simplification.
- A redirect is not a substitute for appropriate canonical/indexability reasoning, and a canonical is not a substitute for a required redirect.

### 5.3 Structured data — product requirements

Potential structured-data types include Organization, WebSite, Breadcrumb, Product, Article, FAQ, and LocalBusiness/branch only where the source/approved data supports them. The current source schema is UNKNOWN.

Requirements:

- represent only factual approved data;
- align product prices/availability/schema with displayed and validated catalog state;
- align article metadata with actual published content;
- use branch/local data only after addresses/status/ownership are confirmed;
- validate structured data before launch;
- never add reviews, ratings, offers, locations, claims, FAQs, or delivery promises that PENA AMEEN cannot substantiate.

## 6. Internal linking requirements

Internal linking must serve visitors and discovery, not manufacture SEO links.

### Required link relationships — PROPOSED

| From | To | Purpose |
|---|---|---|
| Home | Shop, core educational methods, selected approved content, branches/help | Orient multiple visitor intents |
| AL-BARQY / ACM topic pages | Relevant articles, categories, products | Connect education to product discovery |
| Article | Related article, method page, relevant category/product where editorially appropriate | Help visitor learn and continue |
| Product | Relevant category, related product, approved educational context | Support evaluation and cross-discovery |
| Category | Product detail, educational context, adjacent relevant category | Browse and understand catalog |
| Branch/community content | Branch detail, approved event/gallery/contact | Local/community navigation |
| Help/order/tracking | FAQ, policy, contact, tracking | Reduce support friction |

Internal links inherited from source content must be inventoried/replaced during migration. Broken old URLs and content moves must be part of redirect and content QA.

## 7. Sitemap and redirect requirements

### Sitemap

The platform must be able to expose a current sitemap representation for eligible public pages/products/categories/articles/branches and other approved public content. The source sitemap is UNKNOWN, so no parity claim can be made yet.

Before launch, sitemap validation must consider:

- source/target URL inventory reconciliation;
- canonical and indexability intent;
- no inclusion of private/checkout/order/account states unless explicitly approved;
- priority source URL availability;
- post-launch Search Console monitoring after access is supplied.

### Redirect management

Each source URL needs a documented treatment:

- **KEEP** — same viable URL/content intent;
- **REWRITE** — new page/URL with relevant permanent redirect where appropriate;
- **MERGE** — meaningful consolidated destination with permanent redirect;
- **REDIRECT** — old content omitted but routed to an equivalent relevant destination;
- **ARCHIVE** — retained/limited visibility according to approved policy;
- **NO-MIGRATE/RETIRE** — only with explicit SEO/client decision and correct response behavior.

Requirements:

- capture old URL, target URL/treatment, redirect type, page type, rationale, owner/status, and test result;
- prevent default unrelated homepage redirects;
- test priority URL behavior pre-launch;
- monitor 404s/redirects post-launch;
- preserve query-independent canonical intent and document trailing-slash/normalization behavior later.

## 8. Content lifecycle and safeguards

### Proposed lifecycle

Content records need an approved state that distinguishes at least draft/review/published/archived or equivalent. The exact editorial approvals, scheduling, revision history, author workflow, and archival visibility are not confirmed.

### Safeguards

- Changing/deleting a public slug must warn of SEO and internal-link impact.
- Removing/archiving a product, category, article, branch, event, tag, or media asset must trigger source URL/content treatment review.
- Media needs rights/permission review before public reuse.
- Editorial claims about methods, learning outcomes, testimonials, or availability must use approved source material.
- Legal/policy content must be client-approved and version-controlled appropriately in later implementation.

## 9. Content-to-commerce success criteria

No numerical KPI is invented. The product should eventually make it possible to assess whether:

- content pages can be found and understood by target visitors;
- visitors can move from relevant education content to appropriate product/category detail without dead ends;
- product pages have sufficient accurate context to support purchase decisions;
- priority old URLs resolve or redirect correctly;
- internal links do not lead to avoidable 404s;
- public metadata/sitemap/structured-data output is valid and reflects actual content;
- staff can update content/product context without breaking discoverability.

Metrics, targets, attribution, analytics provider, and reporting cadence are CLIENT DECISION REQUIRED.

## 10. Architecture/migration gates

Content/SEO architecture cannot be finalized without:

1. a full WordPress/WooCommerce export and media inventory;
2. full URL/sitemap/robots/canonical/metadata/schema inventory from a crawl/export/Search Console;
3. a redirect matrix with treatment for every valuable source URL;
4. content treatment decisions for old articles/pages/events/galleries/tags/author archives;
5. branch list, active status, address/contact data, and local-content approval;
6. media ownership/rights and alt/caption data;
7. approved claims, legal policies, language/market strategy, and editorial operations;
8. client access to Search Console/analytics as applicable.

These are evidence and decision gates, not a request to overwrite existing migration documentation.
