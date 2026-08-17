# PENA AMEEN Search Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Provider-agnostic search requirements. This document does not choose a search engine, index, query parser, ranking algorithm, synonym list, or analytics provider.

## 1. Search purpose

Search should shorten the path from a visitor’s intent to an accurate PENA AMEEN product, article, category, method page, or approved support destination. It must complement browsing rather than require the customer to know the catalog or taxonomy structure.

The search experience must protect the distinction between:

- a product that can be evaluated/purchased;
- educational content that helps a visitor learn;
- a retained category/archive/method landing page;
- an unavailable, retired, or no-longer-indexed result;
- a query that has no confident result.

## 2. Requirements

| Requirement ID | Requirement | Priority | Status | Dependency |
|---|---|---|---|---|
| REQ-SRH-001 | Customers can search eligible product names and approved product discovery information. | MUST HAVE | CONFIRMED product requirement | Complete catalog, product status, indexing scope |
| REQ-SRH-002 | Visitors can search eligible articles and educational content, or be routed to a clearly scoped content-search path. | SHOULD HAVE | PROPOSED | Content inventory and public-search policy |
| REQ-SRH-003 | Search results identify result type and provide a relevant route to product, content, or category detail. | MUST HAVE | PROPOSED | Search data model and IA |
| REQ-SRH-004 | Search supports category discovery and contextual filters without forcing an unapproved taxonomy redesign. | MUST HAVE | PROPOSED | Catalog/content taxonomy and source archive decisions |
| REQ-SRH-005 | Search has understandable autocomplete/suggestions and empty/no-result states. | SHOULD HAVE | PROPOSED | Query/index behavior |
| REQ-SRH-006 | Relevance and typo tolerance must be evaluated with PENA AMEEN terminology and language strategy, but no engine/matching rule is chosen now. | SHOULD HAVE | CLIENT DECISION REQUIRED | Search engine, language/terms, catalog/content data |
| REQ-SRH-007 | Search failures, unavailable results, and no-result queries have safe recovery paths and do not masquerade as valid results. | MUST HAVE | PROPOSED safety requirement | Resilience/operational design |

## 3. Searchable content scope

### MUST HAVE — product search

Product search should consider approved searchable information such as verified product name, relevant category/method context, and description/SKU only if PENA AMEEN approves customer-facing SKU search. It should exclude draft, private, inactive, or otherwise ineligible products according to the future product policy.

The following source data is still UNKNOWN: complete product list, product status, descriptions, SKU, variant structure, synonyms, and language strategy.

### SHOULD HAVE — article and education search

A visitor should be able to discover approved public articles and educational/method landing pages. Result content must reflect published/retained content and source URL decisions. Whether articles and products appear in one result set or separate scopes is a Phase 2/experience decision.

### Conditional searchable areas

| Content type | Candidate inclusion | Decision dependency |
|---|---|---|
| Product categories | Yes, when retained and useful | Taxonomy/SEO archive policy |
| Article categories/tags | Yes, when retained and meaningful | Archive/indexability policy |
| AL-BARQY / ACM landing pages | Yes | Content/pillar approval |
| Branches | SHOULD HAVE | Branch data/visibility policy |
| Events | CLIENT DECISION REQUIRED | Event source/retention strategy |
| FAQ/help | SHOULD HAVE | Approved FAQ/support content |
| Legal policy | Optional | Legal/search policy |
| Cart/checkout/order/account | No public search | Private/transactional nature |
| Admin data | Never public search | Authorization/security boundary |

## 4. Search interaction requirements

### 4.1 Search entry points

- The Shop experience must provide a clear product-search entry point.
- A broader public search entry point is **SHOULD HAVE** if it can clearly distinguish products and content.
- Search context should be visible: the query, current scope/filter, and a route back to browsing.
- Final header placement, mobile interaction pattern, and page/modal behavior are design decisions, not set here.

### 4.2 Result presentation

Each result must have a clear result type and a meaningful next action.

| Result type | Required useful information | Primary action |
|---|---|---|
| Product | Verified name, image/fallback, eligible price/availability representation, category/context where useful | View product |
| Article | Title, concise approved excerpt/context, category/method/date where useful | Read article |
| Category/archive | Name and helpful description/context where retained | Browse category |
| Method landing | AL-BARQY/ACM context and relevant discovery label | Explore method |
| Branch/help | Approved name/context and safe destination | View detail / contact |

Search must not expose non-public price, inventory quantity, customer/order information, unpublished content, irrelevant internal records, or unverified marketing claims.

### 4.3 Filters and refinement

Candidate filters should be offered only when there is trustworthy data and a clear user benefit:

- product category — MUST HAVE;
- result type (product/content/category) — SHOULD HAVE for unified results;
- availability — SHOULD HAVE once inventory rules are confirmed;
- method/format/use case — SHOULD HAVE after taxonomy review;
- price — SHOULD HAVE after price/currency/merchandising rules are approved;
- content topic/category — SHOULD HAVE if archives are retained;
- branch/region/event date — CLIENT DECISION REQUIRED because data and experience scope are unknown.

A filter must not return misleading empty results due to incomplete migration/index data without an explanatory state.

### 4.4 Autocomplete and suggestions

Autocomplete/search suggestions are **SHOULD HAVE**, not a prerequisite for commerce completion. If implemented later, suggestions should:

- be clearly related to the typed query;
- identify product, category, or content type where useful;
- remain safe for incomplete/short queries;
- include a “view all results” path;
- avoid revealing personal, order, admin, or sensitive query data;
- handle unavailable service/state gracefully.

## 5. Relevance, language, and typo tolerance

### Relevance principles — PROPOSED

1. Exact product and method intent should be discoverable when approved source data exists.
2. Search should not elevate unrelated products merely because a generic word appears.
3. Product availability/visibility and publication state should be respected.
4. Source taxonomy and legacy SEO structure must not be silently changed by search indexing.
5. Editorial/content relevance should not make unsupported health, education, or performance claims.

### Client decisions required

- Primary launch language(s) and any alternate-language strategy;
- approved vocabulary for `Pena Ameen`, `AL-BARQY`, `ACM`, `Aku Cepat Membaca`, product names, and approved spelling variants;
- whether SKU search is customer-visible;
- whether typo tolerance, synonyms, stemming, transliteration, and query corrections are required at launch;
- whether popularity, sales, manual merchandising, or recency influence ranking;
- query-data retention, analytics, privacy, and staff controls.

No relevance weight, synonym, spelling correction, language model, or search provider is invented.

## 6. Empty, error, and recovery states

| State | Required behavior |
|---|---|
| Empty query | Explain how to search or offer browse/category paths; do not manufacture a result list. |
| No results | State that no matching result was found, preserve the query, offer spelling/refinement/category/help options where approved. |
| Filter produces no results | Show active filters and an easy way to remove/refine them. |
| Result retired/unavailable | Route to documented product/content retirement or redirect behavior; do not show a stale purchasable result. |
| Index/search temporarily unavailable | Explain a temporary issue and offer shop/content navigation or retry; do not silently show an incomplete list as complete. |
| Unsupported/sensitive query | Do not expose internal/sensitive data; offer safe public navigation. |
| Search result data incomplete | Avoid misleading price/availability/media representation; use approved fallback or omit the incomplete field. |

## 7. Search measurement requirements

The eventual analytics plan should be able to measure `search_performed`, query context subject to privacy policy, filters, result type clicks, zero-result searches, and search-to-product/article progression. Event schema, analytics provider, consent, retention, and targets are deferred to `docs/ANALYTICS-PRD.md` and client decision.

## 8. Dependencies and boundaries

Search architecture/implementation depends on the full catalog/content/taxonomy export, content publishing/visibility policy, source archive/redirect decisions, language strategy, approved terms, SEO policy, analytics/privacy policy, and search provider selection. Phase 1 does not select an engine or implement indexes.
