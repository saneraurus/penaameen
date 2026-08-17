# PENA AMEEN Content and Education UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED content/education presentation model. It preserves the Phase 2 taxonomy and route distinctions; it does not create new categories, visual sub-brands, unapproved learning claims, or content assets.

## 1. Content experience objective

Content helps visitors understand PENA AMEEN educational context, discover relevant resources, build trust, and continue to product/category/contact paths when appropriate.

```text
Blog / search / SEO landing
→ article or education hub
→ relevant resource, category, product, branch, or help path
```

The correct outcome can be learning or support rather than purchase.

## 2. Blog and article UX

| Area | Hierarchy | UX requirements | State/dependency |
|---|---|---|---|
| Blog archive | Archive identity → topic/category context → article cards → pagination | Distinguish article topic/type; support discovery without dense tag cloud | Retained article inventory/category treatment required |
| Article detail | Title → approved author/date/category context → body/media → related context | Readable body measure, heading hierarchy, media captions/alt, internal links, source-aware date/author treatment | Source body/media/author/taxonomy/SEO data partial |
| Content category | Category identity/description → article list → related education context | Publish only meaningful retained archive; avoid duplicate hub/tag page | Archive retention/indexability decision required |
| Content tag/author | Conditional legacy/archive treatment | Show only if approved meaningful scope; otherwise redirect/noindex/merge behavior | CDR-022 and SEO mapping |
| Related article | Editorially relevant continuation | Link where topic/context helps user; avoid unrelated infinite content grid | Approved content relationship required |

## 3. Education hubs

### AL-BARQY

AL-BARQY must remain visibly distinct as:

1. a retained **product category** where source confirms it;
2. a **content category/source archive** subject to migration treatment; and
3. an **education hub** with explanatory/curated purpose.

The hub explains approved method context, presents approved resources/articles, and links to relevant AL-BARQY products/categories without duplicating a product grid or category archive.

### ACM

ACM must remain visibly distinct as:

1. a **content category/source archive** subject to migration treatment;
2. an **education hub** with explanatory/curated purpose; and
3. a **product-family classification**, not a confirmed public product category.

Do not design an unsupported ACM product-category UX or imply full product family membership until catalog/SEO decisions confirm it.

## 4. Education conversion paths

| Entry | Appropriate next path | Guardrail |
|---|---|---|
| AL-BARQY article | AL-BARQY hub, relevant article, retained product category/product | No outcome or suitability claim without approved content |
| ACM article | ACM hub, approved related product family/product | No invented `/product-category/acm/` or complete catalog claim |
| Education hub | Resource/article, relevant category/product, contact/FAQ | Hub has narrative/curated role, not duplicate archive grid |
| Product detail | Relevant hub/article/category context | Product remains evaluable without content detour |
| Branch/community content | Local/contact/approved education/product context | No local inventory/service promise unless verified |

## 5. Article navigation and internal linking

- Breadcrumb/context reflects logical Education/Blog relationship without fabricating URL parentage for root-level articles.
- Related links are purposeful and source/editorially approved.
- Legacy article/category/tag/author routes preserve/migrate according to SEO mapping, not design preference.
- Link labels describe destination purpose, not generic “click here.”
- Internal links are visible in reading sequence and accessible by keyboard/screen reader.

## 6. Content states

| State | UX treatment |
|---|---|
| Loading | Preserve reading/discovery hierarchy without fake body content |
| Missing media | Keep article/product meaning and show approved fallback/alt context |
| Empty archive | Explain no currently retained items and provide useful alternate path; do not publish thin archive as normal |
| Archived/redirected source | Follow documented redirect/archival policy; do not send unrelated page home |
| Draft/private | Never render in public discovery/search/SEO path |
| Content unavailable | Safe error/retry/help path without exposing private source data |

## 7. SEO and accessibility

Articles/hubs/categories need server-rendered readable hierarchy, title/metadata/canonical/indexability/structured-data inputs where approved, semantic headings, accessible media, clear link text, and responsive readable measure. Design cannot compensate for missing source metadata or media rights; it must surface content-quality gaps for editorial/SEO review.
