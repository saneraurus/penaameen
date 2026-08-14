# PENA AMEEN Performance Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory performance implementation rules. Proposed budgets from Phase 3 are targets to validate, not measured claims or fixed provider configuration.

## 1. Rendering and cache rules

- Server-render indexable public routes and avoid unnecessary client components/JavaScript.
- Cache/revalidate approved public data by route/data lifecycle; private cart/checkout/account/order/tracking/admin is no shared cache by default.
- Revalidate product/current commercial state before cart/checkout/order mutation; cache never becomes money/inventory authority.
- Do not fetch application APIs from server components when direct approved service/query access is available.

## 2. Asset and bundle rules

- Add client JavaScript only when interaction requires it; measure/justify new client dependencies.
- Load fonts through approved strategy with fallback/coverage/performance review; no final font before brand approval.
- Use MediaAsset/Variant/Usage architecture for responsive image delivery; reserve media space and defer noncritical assets.
- Avoid render-blocking, duplicate network requests, unbounded list payloads, autoplay/ornamental motion, and client-side duplication of server state.

## 3. Data/query rules

- Paginate bounded lists and admin queues.
- Avoid N+1/read amplification; review query shape/read model against route task.
- Do not hold transactions/locks during provider/network calls.
- Monitor query/lock/connection/job/search/provider latency and failure patterns.

## 4. Measurement rule

Performance changes require relevant route/task measurement, Core Web Vitals/server/query/worker evidence as applicable, regression comparison, and documented impact. Optimize proven bottlenecks without weakening correctness, accessibility, SEO, or migration safety.
