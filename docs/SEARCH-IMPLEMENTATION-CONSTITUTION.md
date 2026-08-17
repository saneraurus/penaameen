# PENA AMEEN Search Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory search rules. MVP remains PostgreSQL-first behind a search port; language, synonyms, typo tolerance, ranking, provider, analytics, and retention remain client-gated.

## 1. Boundary

```text
Public search delivery → Search service → Search Port → PostgreSQL-first implementation
                                                  ↘ future external adapter only if approved
```

Search derives eligible public documents from Catalog, Content, Education, Branch, SEO, and publication state. It never becomes source of truth for those domains.

## 2. Mandatory rules

- Index only published/active/approved public targets with canonical route eligibility.
- Remove/rebuild stale document after publication, retirement, redirect, taxonomy, media, or SEO changes through durable events/jobs.
- Normalize/bound queries and scopes; rate-limit abuse-prone search/autocomplete paths.
- Allowlist filters/sorts/result types; no raw query construction or implicit taxonomy creation.
- Return direct canonical destination links; query/filter/sort state remains non-indexable.
- Group result types and distinguish no-result, unavailable, private, and failure state.
- Relevance/synonym/typo adjustments are explicit versioned configuration with editorial/product approval, not hidden code heuristics.
- Search indexing failure is observable and retried safely; it never exposes draft/private/customer/order/admin data.

## 3. External search gate

An external engine requires measured PostgreSQL limitation evidence, cost/security/privacy/sync/rollback/monitoring analysis, approved provider/account, and migration plan. No external engine may be introduced only for style or popularity.
