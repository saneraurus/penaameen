# PENA AMEEN Search UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED search experience model. Search technology, relevance engine, language, synonym/typo policy, analytics retention, and provider remain governed by Phase 3 architecture and client decisions.

## 1. Search entry and intent

One global public search entry supports products, education hubs, articles, retained categories, and approved help/branch content. Shop and Education contexts may preselect scope but do not create competing search systems.

| Entry context | Initial emphasis | User control |
|---|---|---|
| Header utility | Global public search | Scope/type refinement after query |
| Shop | Products and retained product categories | Broaden to global/education if helpful |
| Education/Blog | Hubs/articles/content categories | Broaden to product/global if helpful |
| Empty cart/404 | Global or Shop recovery | Browse/refine without dead end |

## 2. Search interaction

```text
Search entry
→ query input
→ optional suggestions
→ submit/authoritative result state
→ grouped result types
→ refine/filter/sort within approved scope
→ direct canonical destination
```

Suggestions are an enhancement, not a replacement for submitted search. They must not leak private/admin/customer/order data or assume a search provider.

## 3. Results hierarchy

| Result type | Required presentation context | Primary action | Guardrail |
|---|---|---|---|
| Product | Name, approved media/fallback, eligible price/availability context, category/method where valid | View product | No unpublished/unavailable product as purchasable result |
| Product category | Name and meaningful context | Browse category | Only retained category archive |
| Education hub | AL-BARQY/ACM identity/context | Explore hub | Avoid duplicate category/tag copy |
| Article | Title, approved excerpt/topic/category/date context | Read article | No source claim/content truncation distortion |
| Content category/tag | Archive identity only where retained | Browse approved archive | Tags/authors remain conditional |
| Branch/help | Approved name/context | View detail/contact | Only active/public data |

## 4. Filtering, sorting, and pagination

- Show only allowed filters with valid data and a clear user purpose.
- Display active filter/scope/sort state and a clear reset/refine path.
- Product/category/content filters do not become new visual taxonomy or indexable SEO pages.
- Sort options require approved definitions; price/popularity/newness are not assumed.
- Pagination maintains result context and direct canonical destination links; exact behavior follows Phase 2/3 SEO architecture.
- Compact layout places refinement access before or alongside results without hiding query/result identity.

## 5. No-result, typo, and failure UX

| State | UX response |
|---|---|
| Empty query | Explain search purpose and offer Shop/Education browse paths |
| No result | Preserve safe query, state no eligible result, offer clear/refine/category/help actions |
| Product-scope no result | Offer Shop/category/global/education alternative as appropriate |
| Filter no result | Show active filters and one-step clear/refine action |
| Typo/suggestion candidate | Present as optional correction, not a forced replacement; policy/language approval required |
| Search unavailable | Explain temporary issue and offer browse/retry/support; do not imply catalog is empty |
| Retired result | Use route redirect/retirement policy; do not show stale purchasable data |

## 6. Accessibility and responsive rules

- Search has visible label or accessible name, keyboard submission, clear focus, and safe autocomplete semantics if enabled.
- Suggestions/results announce result count/state without excessive interruption.
- Result types are identified in text, not icons/color alone.
- Filters/sorts use accessible controls and preserve focus/context after update.
- On compact view, query/result identity remains visible; filter controls do not obscure results or primary recovery action.

## 7. SEO and data boundary

Search query, scope, filter, sort, and result state remain non-indexable as defined by Phase 2/3. Search results link to canonical product/content/category/hub routes. UX cannot expose search document fields not approved for public display.
