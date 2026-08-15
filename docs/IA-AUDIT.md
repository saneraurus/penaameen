# PENA AMEEN Information Architecture Audit

**Phase:** 2 — Information Architecture

**Status:** Audit of the proposed IA against known discovery evidence. It distinguishes verified gaps from planning recommendations; it does not declare migration ready or approve unsupported route changes.

## 1. Audit summary

| Audit area | Finding | Risk | Recommendation | Status |
|---|---|---|---|---|
| Public navigation | Current source exposes many top-level labels; proposed IA reduces this to Shop, Education, Branches, Profile/About plus utilities | Navigation overload | Keep primary navigation small; move categories, events, gallery, FAQ, policies into secondary/footer/contextual layers | PROPOSED |
| Commerce discovery | Shop, product categories, products, cart, and checkout source intent are clear | Low if legacy paths retained | Keep Shop prominent; preserve/migrate verified product/category paths | PROPOSED / migration-sensitive |
| Product taxonomy | Source mixes method, format, and catch-all categories | Duplicate/thin taxonomy | Retain legacy categories conservatively; use method/format as attributes where appropriate; do not add ACM category yet | PROPOSED / CDR |
| Content taxonomy | AL-BARQY/ACM category/tag/hub patterns can duplicate | SEO duplication | Use education hubs as canonical pillar candidates; merge legacy ACM/AL-BARQY archive intent only after equivalence review | PROPOSED / CDR |
| Legacy URLs | 30 exact discovered URLs plus 2 unverified utility candidates mapped | Critical if inventory remains partial | Keep/redirect/merge only per mapping; expand from sitemap/export/Search Console before launch | PARTIAL |
| Account/checkout | Required destinations exist but account/guest/lookup policy is unresolved | Privacy/commerce flow gap | Keep private routes separate; do not force accounts | PROPOSED / CDR |
| Admin IA | Deep task groups are defined without leaking to public navigation | Low if permission controls follow | Use task-oriented groups and later least-privilege model | PROPOSED |

## 2. Orphan audit

### 2.1 Known or at-risk orphaned content

| Item/group | Evidence | Current IA destination | Orphan risk | Required action |
|---|---|---|---|---|
| Four confirmed articles | Source article URLs and content inventory | Blog, relevant hub, retained root article route | Low in proposed map | Preserve root routes; add Blog/hub/contextual links after content export |
| Other source article categories | Category counts exceed confirmed article list | Conditional `/category/[slug]/` or mapped destination | High | Obtain export; decide retain/merge/archive/redirect per category before launch |
| `/tag/acm/` | Confirmed source tag archive | Proposed merge to ACM hub | Medium | Validate content equivalence and redirect decision; do not leave duplicate pillar/tag archive |
| `/author/penaameen/` | High-confidence source archive | Conditional legacy treatment | High | Confirm public attribution/archive value or redirect/noindex with SEO approval |
| Gallery | Indexed source route | Conditional gallery route | High | Confirm active content/media rights and retain/archive/redirect decision |
| Events | High-confidence source archive, details unknown | Conditional events routes | High | Obtain event inventory; decide continue/archive/merge/redirect |
| Branch pages | Two source pages confirmed | Proposed Branches index/detail and redirect candidates | Medium | Confirm active data, local content, and direct target paths |
| Profile | Source `/profile/` | Same route | Low | Preserve content/route or map with documented target |

### 2.2 Known or at-risk orphaned products

| Item/group | Evidence | Proposed discovery paths | Risk | Required action |
|---|---|---|---|---|
| Known ALBARQY products | Four known product URLs/names across source evidence | Shop; AL-BARQY category; AL-BARQY hub; search | Low if catalog confirms membership | Validate product/category/hub links and active status |
| Known ACM products | Product URLs/names and ACM content evidence | Shop; ACM hub; search; verified category membership | Medium | Do not invent ACM category; validate product-family classification |
| Products with unknown URL | ACM 2, PENGANTAR ILMU HUKUM, other possible packages | No canonical public route can be assigned safely | High | Receive catalog export and add routes/mappings before launch |
| Discontinued/draft products | Status unknown | Must not remain purchasable/indexable by accident | High | Confirm lifecycle/status and redirect/archive policy |

## 3. Duplicate taxonomy audit

| Potential duplicate | Why it is a risk | IA control |
|---|---|---|
| AL-BARQY product category, article category, and education hub | Same phrase spans product and content domains | Give each a distinct job: product browse, content classification, explanatory hub. Merge legacy article category only after review; retain product category separately. |
| ACM article category, tag, hub, and possible future product category | Source has category/tag/hub evidence but no product category confirmation | One ACM hub is the proposed editorial canonical; tag/category merge candidates require review; product remains a family attribute until approved. |
| Flashcard/CD category versus product format attribute | Legacy categories may be formats rather than durable browse intents | Preserve legacy archives during migration, but do not create additional public format facets/duplicates. |
| Umum product category versus Umum content category | Same generic label across different domains can confuse visitors/crawlers | Keep domains/routes distinct; client must decide whether each archive remains meaningful. |
| Product tags/author labels as categories | Tags may duplicate categories or represent author metadata | No public tag expansion without distinct purpose/ownership/indexability decision. |
| Branch region as category/tag | Could create location taxonomy and duplicate local pages | Use Branch entity/detail route rather than branch tags/categories. |

## 4. Duplicate route audit

| Potential duplicate route | Proposed prevention |
|---|---|
| `/profile/` and a new `/about/` | Retain `/profile/` as canonical and permit a label change only. |
| Root article and `/blog/[slug]/` | Retain one root-level article canonical; do not introduce parallel Blog detail paths. |
| `/shop/[category]/` and `/product-category/[slug]/` | Retain legacy product-category route; do not create parallel shop-category route. |
| `/product-category/acm/` and `/education/acm/` | Do not create ACM product category until explicit catalog/SEO decision. |
| AL-BARQY/ACM source category/tag archives and hubs | Proposed merge candidates; no parallel indexable duplicate aggregate pages after approval. |
| Root branch pages and `/branches/[slug]/` | Use direct relevant 301 only after active branch/SEO approval; do not leave both canonical. |
| Gallery and a new generic community archive | Retain/migrate one approved gallery/community content route, not both by default. |
| Search/filter/sort/pagination variants and base collections | Non-index query/filter/sort; pagination policy keeps a distinct list state without duplicate page-one canonical. |

## 5. Unnecessary depth audit

| Area | Avoid | Proposed depth |
|---|---|---|
| Shop | `/shop/categories/[slug]/products/` or `/shop/[slug]/products/` | `/shop/`, `/product-category/[slug]/`, `/product/[slug]/` |
| Education | `/content/education/programs/[pillar]/articles/` | `/education/`, `/education/[pillar]/`, root article URL |
| Branches | `/community/branches/region/[slug]/` | `/branches/`, `/branches/[slug]/` |
| Account | Multiple duplicated profile/order prefixes | `/account/` with one-level subresources |
| Admin | Public-style content nesting or separate unrelated task hubs | `/admin/[task]/` plus detail only where necessary |
| Checkout | Indexable URLs for every step | One `/checkout/` task route with logical states |

## 6. Unnecessary-page audit

The following pages/routes are deliberately not introduced unless a future approved requirement supports them:

- separate `/about/` duplicate of `/profile/`;
- generic `/community/` route separate from Gallery/Branches/Events;
- product category routes for ACM, sale, new, popular, price, audience, stock, or package type;
- individual variant/package URLs;
- tag clouds and default public author hubs;
- public seller/vendor/storefront/payout routes;
- account wishlist, loyalty, referral, subscription, social profile, or messaging routes;
- generic payment/shipping provider return pages as public content;
- duplicate Blog article detail route.

## 7. SEO duplication audit

| Risk | Control |
|---|---|
| Filters/sort create many crawlable URLs | Treat as non-indexable query state; stable collection retains canonical purpose. |
| Search queries create thin landing pages | Keep query results non-indexable. |
| Tags/categories duplicate each other | Use category/tag admission tests and merge/noindex/archive decisions. |
| Hub/category/archive replicate same content | Give hubs a distinct narrative/curated role and merge equivalent legacy archives after review. |
| Pagination canonicalized incorrectly | Page one is base; deeper pages have consistent distinct pagination treatment, reviewed with data. |
| Transaction/private pages indexed | Cart, checkout, order, tracking, account, admin all non-indexable. |
| Legacy sources disappear | Use specific mapping/redirect matrix; never generic home redirect. |
| Product/category/article content copied to new route | One canonical public route per entity; source metadata/internals links migrate or map. |

## 8. Navigation overload audit

### Current-source pressure

Current observed navigation includes Profile, Komunitas, Mitra Cabang, Galeri Kegiatan, Artikel, Events, and Produk. Making all these persistent primary labels would compete with the purchase path and make mobile navigation harder.

### Proposed control

| Keep primary | Group below | Keep as utility/footer/contextual |
|---|---|---|
| Shop; Education; Branches; Profile/About | AL-BARQY; ACM; Blog; retained categories; Events; Gallery | Search; Cart; Account; Track order; Contact; FAQ; Legal; tags/authors |

Final top-level labels remain a client decision, but no evidence supports adding more primary labels than this proposed model.

## 9. Audit conclusion

- **Major Phase 1 requirements orphaned:** 0 of 174 in `docs/IA-REQUIREMENT-MATRIX.md`.
- **Known source content/product data still at risk:** Yes, because source inventory is partial and many source archive/product URLs/data are unknown.
- **Duplicate canonical route patterns introduced:** 0. Conditional legacy/hub/branch conflicts are named and blocked pending decisions.
- **Critical corrective action:** obtain catalog/content/media/URL/SEO exports and approve the client decisions before final route migration/technical architecture.
