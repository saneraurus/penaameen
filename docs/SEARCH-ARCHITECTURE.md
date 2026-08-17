# PENA AMEEN Search Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED MVP search architecture. No search engine, provider, index implementation, synonym list, ranking model, or analytics vendor is selected.

## 1. Search architecture decision

### Proposed MVP: PostgreSQL-backed public search behind a search port

The MVP should begin with PostgreSQL full-text/trigram-capable search and curated normalized search documents/read models for eligible products, education hubs, articles, retained categories, and approved help/branch content. An external engine is deferred until measured catalog/content/query volume, relevance, latency, operational, or autocomplete needs justify it.

```text
Public search route
→ Search application service
→ Search port
→ PostgreSQL search implementation initially
→ Future external adapter only if justified
```

## 2. Search scope and documents

| Result type | Search document/source fields | Eligibility | Route target |
|---|---|---|---|
| Product | Name, approved description/summary, category, method/family, approved SKU search value if allowed | Active/public/eligible product only | `/product/[slug]/` |
| Product category | Name, approved description, taxonomy context | Retained meaningful category only | `/product-category/[slug]/` |
| Education hub | Pillar name, approved summary, related terms | Published/approved hub | `/education/[pillar]/` |
| Article | Title, excerpt/body-derived searchable text, category/tag/method context | Published/retained public article only | `/[article-slug]/` |
| Content category/tag | Name/description where archive is retained | Only approved public archive | `/category/[slug]/` or approved target |
| Branch | Name/region/approved public contact context | Active/approved branch only | `/branches/[slug]/` |
| Help/FAQ | Approved title/summary | Public approved content only | Relevant help route |

Cart, checkout, account, order, tracking results, admin, draft/private products/content, raw PII, payment references, and internal notes are excluded from public search.

## 3. Query flow

```text
Search request
→ rate/abuse control
→ normalize bounded query and scope
→ search only eligible public documents
→ rank/group result types
→ return direct canonical route links
→ render no-result/refinement/recovery state
```

Search query behavior follows `docs/SEARCH-IA.md`: query/filter/scope/sort states are non-indexable and do not produce taxonomy pages.

## 4. Product, article, education, and category search

| Search mode | Default result emphasis | Scope rule | Status |
|---|---|---|---|
| Global | Exact/relevant product, education hub, article, category/help result types | Entry header/search route | MUST HAVE |
| Product | Products then retained product categories | Shop context or explicit product scope | MUST HAVE |
| Education | Hubs/articles then related categories/products where appropriate | Education/Blog context | SHOULD HAVE |
| Category discovery | Retained categories/hubs | Broad query/category intent | SHOULD HAVE |
| Branch/help | Approved branch/help content | Only after source/public policy allows it | CONDITIONAL |

Exact ordering is a proposed relevance policy, not a claim of algorithmic implementation.

## 5. Filtering, sorting, autocomplete, and typo tolerance

| Capability | Architecture position | Status/dependency |
|---|---|---|
| Product category filter | Allowlisted public taxonomy filter | MUST HAVE when category data is valid |
| Result type scope | Products, education, articles, categories as approved | SHOULD HAVE |
| Availability/price/method/format filters | Query-level optional filters, never automatic SEO routes | Requires catalog/policy data |
| Sorting | Allowlisted relevance/default plus approved sort fields | Popularity/newness/price definitions unknown |
| Autocomplete | Bounded, rate-limited query suggestion read model | SHOULD HAVE; requires query/relevance/privacy decisions |
| Typo tolerance | PostgreSQL similarity/trigram candidate initially | CLIENT DECISION REQUIRED for language/term rules |
| Synonyms/transliteration | Curated configuration only | CLIENT DECISION REQUIRED; no inferred educational/brand synonyms |
| External search index | Adapter option | DEFERRED until measured need |

## 6. Indexing and freshness

- A published/updated/retired product, article, category, hub, branch, or FAQ creates a durable indexing/outbox intent.
- The worker builds/rebuilds an eligible search document/read model from authoritative records.
- A product/content record is not searchable until public/published/active state and route eligibility are confirmed.
- Archive/redirect/SEO changes remove or retarget stale search entries.
- Search indexing failure generates observability signals; it must not make a private/draft item publicly discoverable.

## 7. Ranking principles

1. Exact approved product/method/title identity outranks incidental text match.
2. Public eligibility and current publication status are mandatory before rank.
3. Category/hub/article result types are visible so a user understands destination type.
4. Editorial relevance must not fabricate product suitability, health/education claims, regional availability, popularity, or sales ranking.
5. Manual merchandising/ranking requires an approved owner, audit, and client decision.
6. Result ranking cannot override canonical URL/indexability policy.

## 8. No-result and failure behavior

| Condition | Architecture response |
|---|---|
| Empty query | Return a search-entry state with Shop/Education browse paths, not a fabricated result set. |
| No results | Preserve safe query/scope; offer refinement, category, Shop, Education, or Contact path. |
| Filter no results | Return active filter context and clear/reset path. |
| Retired result | Remove from index; route through documented redirect/retirement behavior if reached directly. |
| Search service unavailable | Render safe utility failure/retry/browse path; do not claim catalog is empty. |
| Query abuse | Rate limit/validate without revealing internal search behavior. |

## 9. Observability and privacy

- Measure search submitted, scope, result type clicked, zero-result, filter/refinement, and search-to-product/content progression only under approved analytics/consent policy.
- Avoid unnecessary raw query retention, PII, order data, or identity correlation.
- Observe index freshness, query latency, error rate, zero-result categories, and stale-document counts.
- Search data/caches must respect publication changes and access boundaries.

## 10. External search adoption gate

An external search engine may be evaluated only when measured evidence shows PostgreSQL search cannot meet approved relevance, typo, autocomplete, catalog/content scale, latency, isolation, or operational needs. The decision requires cost, data sync, security, privacy, rollback, provider health, and migration analysis; it is not implied by this architecture.
