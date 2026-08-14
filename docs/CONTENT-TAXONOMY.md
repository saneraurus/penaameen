# PENA AMEEN Content Taxonomy

**Phase:** 2 — Information Architecture

**Status:** PROPOSED content model. It preserves known content patterns and separates content taxonomy from product taxonomy, while keeping AL-BARQY and ACM connected across education and commerce.

## 1. Content taxonomy objective

Content taxonomy should help a visitor understand topics, help a crawler find meaningful topical relationships, and help staff manage content without creating thin/duplicate archives. It must preserve source article/category/tag/author URLs until a documented migration action is approved.

## 2. Content entities and their roles

| Entity | Purpose | Canonical route pattern | Public/indexability treatment | Source status |
|---|---|---|---|---|
| Article | Durable educational/editorial item | `/[article-slug]/` | Indexable when published/retained | Four source articles confirmed; total unknown |
| Article archive | Browse articles | `/blog/` | Indexable | High-confidence source route |
| Education hub | Explains a method/pillar and curates related articles/products | `/education/[pillar]/` | Indexable if approved content exists | New proposed IA destination |
| Content category | Stable topical classification of articles | `/category/[slug]/` only if retained | Conditional; source archive decision required | Multiple source categories observed |
| Content tag | Sparse cross-cutting descriptor | `/tag/[slug]/` only if retained | Noindex/redirect/merge by default until purpose proven | `acm` tag observed; full inventory unknown |
| Author | Attribution, not a default discovery taxonomy | `/author/[slug]/` only if retained | Noindex/redirect/merge by default | `penaameen` archive observed |
| Page | Durable standalone organizational/help/legal content | Explicit stable path | Indexable when public and appropriate | Profile/gallery/branches/events source patterns partial |
| Branch | Local/community content entity | `/branches/[slug]/` proposed | Indexable only if active, accurate, and approved | Two source branch pages confirmed |
| Event | Event or recap content entity | `/events/[slug]/` proposed if continued | Conditional | Archive route known; event inventory unknown |
| Gallery | Curated approved community/activity media page | `/galeri-kegiatan/` legacy candidate | Conditional | Source gallery page indexed; rights/content unknown |

## 3. Categories, tags, authors, and pages are not interchangeable

| Classification | Use it when | Do not use it for |
|---|---|---|
| Content category | A durable primary subject organizes multiple articles and has a meaningful archive purpose | Author names, product formats, one-off campaign labels, every keyword |
| Content tag | A sparse secondary descriptor crosses categories and has a clear discoverability purpose | Repeating category names, AL-BARQY/ACM duplicates, authors, SEO keyword stuffing |
| Author | Attribution/credibility and editorial ownership needs it | A topical category or required public archive |
| Education hub | A pillar needs explanatory narrative, pathways, curated articles, and relevant products | A mechanical replacement for every category archive |
| Page | A single stable organizational/help/legal purpose exists | A generic content category or product filter |

## 4. Existing article category evidence

The source category counts and URLs are partial; counts may overlap and do not establish a complete article inventory.

| Source category | Evidence | Proposed content role | Route/treatment | Status |
|---|---|---|---|---|
| Al-Barqy | Source category/archive; three known related articles | Primary education pillar/category | Merge legacy archive intent into `/education/al-barqy/` only after source-content/SEO review; retain all articles at their source-safe URLs | PROPOSED merge candidate |
| ACM | Source category/archive; ACM article and tag observed | Primary education pillar/category | Merge legacy archive/tag intent into `/education/acm/` only after source-content/SEO review | PROPOSED merge candidate |
| Anak-Anak | Source category archive, count 5 | General content category candidate | Preserve source data; retain/archive/merge decision after export | CLIENT DECISION REQUIRED |
| Business | Source category archive, count 2 | General content category candidate | Preserve source data; retain/archive/merge decision after export | CLIENT DECISION REQUIRED |
| Kesehatan | Source category archive, count 2 | General content category candidate | Preserve source data; retain/archive/merge decision after export | CLIENT DECISION REQUIRED |
| Seminar | Source category archive, count 3 | General content/event-adjacent category candidate | Preserve source data; retain/archive/merge decision after export | CLIENT DECISION REQUIRED |
| Umum | Source category archive, count 2 | General/catch-all category candidate | Preserve source data; retain/archive/merge decision after export | CLIENT DECISION REQUIRED |

No replacement category names, subcategories, or content volume are invented here.

## 5. AL-BARQY and ACM architecture decision

AL-BARQY and ACM have evidence across education, articles, and products. To avoid collapsing unlike concepts, their roles are deliberately separated.

| Role | AL-BARQY | ACM | Decision/status |
|---|---|---|---|
| Educational pillar | Yes; confirmed method positioning | Yes; confirmed literacy/reading method positioning | CONFIRMED |
| Canonical education hub | `/education/al-barqy/` proposed | `/education/acm/` proposed | PROPOSED; client approval needed |
| Article category | Existing `Al-Barqy` source category | Existing `ACM` source category | CONFIRMED source taxonomy; target archive merge pending |
| Product category | Existing `/product-category/al-barqy/` | Not confirmed as source product category | AL-BARQY retain candidate; ACM requires client/catalog decision |
| Product family/classification | Yes, when product source supports it | Yes, when product source supports it | PROPOSED; no independent category route required |
| Standalone educational program entity | Not established | Not established | Do not create in Phase 2 |
| Tag | Not needed by default; duplicates category/hub | Legacy `/tag/acm/` needs merge/redirect decision | No new tags by default |

### Why hubs exist

An education hub has a different purpose from a category archive: it explains the method in approved language, orients visitors, links to selected articles, and provides a restrained path to relevant products. It must not be merely a duplicate list of category posts or products.

### Duplication control

- The hub is the proposed canonical editorial pillar.
- Legacy content categories/tags may be merged/redirected only after source-content and SEO review.
- Product category and product family classifications remain separate from article taxonomy.
- No parallel indexable `/al-barqy/`, `/acm/`, `/blog/al-barqy/`, or unverified product-category ACM route is created.

## 6. Tags and author archives

### Tags

The only specifically observed article tag is `/tag/acm/`. It overlaps the ACM category/pillar and therefore has a high risk of duplicate topical pages. The proposed action is a **conditional merge/redirect to `/education/acm/`**, subject to source inventory, content equivalence, and SEO/client approval.

Other content tags are unknown. New tags must meet a distinct cross-cutting editorial purpose and cannot be created solely from search terms or product names.

### Authors

The observed `/author/penaameen/` archive does not have a confirmed editorial/discovery purpose beyond WordPress source behavior. Preserve it in migration analysis; do not create a public author-hub strategy until PENA AMEEN confirms author attribution, content ownership, and archive value.

## 7. Pages, branches, events, and gallery

| Content area | Public role | Taxonomy rule | Open condition |
|---|---|---|---|
| Profile | Organization/about content | Singleton page, not a category | Preserve/map legacy `/profile/` content |
| Contact / FAQ / policies | Help and legal information | Singleton pages, not articles/tags | Approved content/legal policy required |
| Branches | Local/community records | Branch entity with region/name fields, not a product/content tag | Active list, address/contact/map/rights needed |
| Events | Time-bounded/community records | Event entity; do not force into article category or branch tag | Client must decide continuation/archive approach |
| Gallery | Curated activity/media content | Singleton/curated page, not a tag cloud | Rights/content treatment needed |
| Testimonials | Approved trust evidence | Content component/source record, not a taxonomy term | Permission and claim review needed |

## 8. Content lifecycle and archive rules

- Published, public content can be indexed only when it has a content owner, purposeful route, relevant internal links, and valid metadata/SEO treatment.
- Draft, private, preview, expired event, unapproved testimonial, empty archive, and private support/account content must not be treated as public indexable content.
- Archived source content requires a specific keep, redirect, merge, archive, or retire decision; deletion is not an IA shortcut.
- A category/tag/archive with no meaningful retained items or editorial purpose must not persist as a thin indexable page.

## 9. Open decisions

- Client approval of the AL-BARQY/ACM hub/category/archive relationship (`CDR-027`).
- Full article/category/tag/author export and per-archive retention decisions (`CDR-006`, `CDR-007`, `CDR-022`).
- Continuation/ownership of Events, Gallery, testimonials, and branches (`CDR-014`–`CDR-016`).
- Editorial workflow, author visibility, language/claims, content rights, and public SEO metadata.
