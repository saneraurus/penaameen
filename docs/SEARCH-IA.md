# PENA AMEEN Search Information Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED search scope and route behavior. No search technology, index, ranking algorithm, synonym list, data-retention rule, or provider is selected.

## 1. Search model decision

### Proposed model: one global public search with contextual scopes

PENA AMEEN should use one public search entry at `/search/` that can return eligible products, education hubs, articles, retained categories, and approved branch/help content. Contextual search from Shop or Education preselects a scope; it does not create separate competing search systems or indexable search archives.

```text
Global search /search/
├── Products                  [Shop context/default when user enters through Shop]
├── Education hubs
├── Articles
├── Retained categories
└── Approved branches/help    [only once source data/public policy permits]
```

This model supports a visitor who knows a product/method name while preserving clear context for a shopper who wants products only.

## 2. Search destinations and URL behavior

| Route/state | Purpose | Indexable? | Canonical/SEO behavior | Status |
|---|---|---:|---|---|
| `/search/` | Search entry with no query | No | Utility route, non-indexable | MUST HAVE |
| `/search/?q=[query]` | Global query results | No | Query-specific result is not an SEO canonical landing page | MUST HAVE |
| `/search/?q=[query]&scope=products` | Product-context results | No | Non-indexable search state | MUST HAVE |
| `/search/?q=[query]&scope=education` | Education/article-context results | No | Non-indexable search state | SHOULD HAVE |
| `/search/?q=[query]&type=[type]` | Result-type refinement | No | Non-indexable query state | SHOULD HAVE |
| Product/category/article/hub route | Result destination | According to destination | Destination retains its own canonical SEO identity | MUST HAVE |

Search URL query syntax is illustrative; final parameter naming/normalization is later technical work. The IA decision is that query/scope/filter variations do not become crawlable duplicate pages.

## 3. Searchable scope

| Result type | Include? | Why | Route destination | Dependency |
|---|---|---|---|---|
| Eligible products | Yes | Core commerce discovery | `/product/[slug]/` | Complete catalog/status/index scope |
| Retained product categories | Yes | Helps a broad shopper intent | `/product-category/[slug]/` | Taxonomy/SEO decision |
| AL-BARQY and ACM hubs | Yes | Supports method-first discovery | `/education/[pillar]/` | Hub content approval |
| Eligible articles | Yes | Supports education/organic content discovery | `/[article-slug]/` | Content inventory/publication state |
| Retained article categories | Conditional | Helps only if archive has distinct approved value | `/category/[slug]/` | Archive retention decision |
| Retained tags/authors | Conditional, usually excluded | High duplication/thin-archive risk | Only approved target/archive | Tag/author review |
| Branches | Conditional | Supports local/contact intent if data is accurate | `/branches/[slug]/` | Active branch data/privacy policy |
| Events | Conditional | Supports active/approved event intent | `/events/[slug]/` | Event continuation decision |
| FAQ/help/legal | Should have | Supports support intent | Relevant page | Approved content/public policy |
| Cart/checkout/account/order/admin | Never public search | Private/stateful/internal | Not applicable | Security/privacy boundary |

## 4. Result hierarchy and relevance rules

### Result hierarchy

Results are grouped by type so a visitor understands whether an item is a product, learning resource, category, or help destination.

| Query intent example | Highest-priority eligible result types | Next eligible result types | Avoid |
|---|---|---|---|
| Exact product name | Exact product; verified product category | Relevant education/article context | Unpublished or unavailable product as purchasable result |
| AL-BARQY / ACM | Education hub; relevant product category/family; exact product | Articles and retained category archive | Duplicate category/tag/archive copies of same pillar |
| Broad product format such as flashcard/CD | Retained product category; matching products | Relevant education context | Creating a new filter/category from a one-off query |
| Informational question | Relevant article/hub/FAQ | Related category/product only where justified | Forced product promotion |
| Branch/location inquiry | Approved branch/contact | General help | Unverified branch/contact data |

### Relevance guardrails

- Exact approved product/method identity should not be displaced by unrelated generic matches.
- Product availability/publication status and content publication status must be respected.
- Search should not infer synonyms, typo correction, regional service, audience, product suitability, or marketing claims until PENA AMEEN approves them.
- The final language/term strategy for `Pena Ameen`, AL-BARQY, ACM, and product names is a client/search decision.

## 5. Empty, no-result, and error states

| State | Required IA behavior | Safe next paths |
|---|---|---|
| Empty query | Explain search scope or offer Shop/Education browse paths | Shop; Education; category list |
| No results | Preserve query context; state no eligible match; offer refinement/help | Clear query; browse Shop; Education; Contact |
| Product-only no results | Offer category/shop path and, when appropriate, global/education scope | Shop; global search; Education |
| Filter/type no results | Show active refinement and let user remove/refine it | Clear type/filter; base result set |
| Retired/unavailable target | Do not present stale purchasable result; use documented redirect/retirement state | Relevant category/hub or search refinement |
| Search unavailable | Preserve navigation and offer browse/retry path | Shop; Education; Contact |
| Sensitive/internal query | Do not expose private/admin/order/account data | Public navigation only |

## 6. Search and SEO separation

- Search is an on-site discovery tool, not a generator of SEO landing pages.
- `q`, scope, result-type, sort, filter, and pagination combinations are non-indexable by default.
- Product/category/article/hub routes remain the canonical targets for public discovery and organic search.
- Search pages must not replace legacy URL mappings, category archives, hubs, sitemap entries, or internal links.
- Search result links should point directly to a canonical destination, not to another query state where a direct route is available.

## 7. Search navigation integration

| Entry point | Initial scope | User can refine to | Reason |
|---|---|---|---|
| Header utility | Global | Products, Education, Articles, categories | Supports unknown intent |
| Shop | Products | Global/education when helpful | Keeps commerce task fast |
| Education/Blog | Education/articles | Global/products when helpful | Keeps learning task focused |
| Category/product | Product or related public scope | Global as needed | Supports adjacent discovery |
| Empty cart / 404 | Global or Shop starting point | All public scopes | Recovery without dead end |

## 8. Open decisions

- Approved product/article/category/branch search scope after full source export.
- Launch language, terminology, synonyms, typo tolerance, relevance and merchandising policy (`CDR-019`).
- Customer-facing SKU search, if any.
- Query analytics/retention/consent/access (`CDR-018`).
- Search technology and implementation are intentionally out of scope.
