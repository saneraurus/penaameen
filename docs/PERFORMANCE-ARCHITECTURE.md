# PENA AMEEN Performance Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED performance budgets and architecture. These are target criteria, not measured benchmark results, capacity claims, or hosting commitments.

## 1. Performance principle

Performance protects discovery, SEO, accessibility, trust, and conversion. Public product/content pages must render meaningful server HTML quickly; cart/checkout/order/tracking must remain responsive and correct under provider variability; admin needs usable task performance without forcing public-page caching rules onto private data.

## 2. Proposed experience targets

Targets apply to approved representative production-like conditions and should be measured at the 75th percentile after environment/device/network baselines are defined. They are proposed quality budgets, not current results.

| Metric | Proposed target | Applies to | Notes |
|---|---|---|---|
| LCP | ≤ 2.5 s | Public indexable pages, especially Home/Shop/Product/Article | Requires image, server-render, cache, and content budget discipline |
| INP | ≤ 200 ms | Public interactive controls, Cart, Checkout, Admin critical controls | Long provider work must not block main interaction thread |
| CLS | ≤ 0.1 | Public/content/commerce layouts | Reserve media/content/control space; final UI work validates |
| TTFB | ≤ 800 ms | Cacheable public route requests at p75 target | Excludes user/provider action completion; depends on host/cache/data design |
| Public route server response | Budgeted and monitored by route class | Public SSR/SEO routes | No fabricated fixed benchmark; establish route budgets in Phase 6 |
| Search response | ≤ 500 ms p95 target at MVP-scale query load | Public search/autocomplete backend portion | Validate with actual catalog/content/query volume |
| Cart/checkout mutation acknowledgement | ≤ 1 s p95 application response target excluding asynchronous provider completion | Cart/checkout state changes | Must return truthful pending/recovery state rather than wait indefinitely |
| Background job latency | Defined per event type before launch | Notifications/indexing/tracking | No global SLA invented; alert on backlog/failure |

## 3. Rendering and caching architecture

| Route/data class | Performance strategy | Correctness guardrail |
|---|---|---|
| Home, Education, Blog, Article, Profile, approved Branch/Event/Gallery/Legal | Server-rendered and cache/revalidate eligible public content | Publish/SEO/media changes invalidate/revalidate; no stale unapproved content |
| Shop/category/product | Server-rendered public catalog view with selective cache/revalidation | Recheck current price/availability/inventory before cart/checkout mutation |
| Search | Efficient indexed database/read-model query with bounded result payload | Never expose private/draft/unavailable data; query results non-indexable |
| Cart/checkout/account/order/tracking/admin | Private/server-authoritative/no shared cache | No caching across customer/staff identity or stale state claim |
| Sitemap/robots/redirects | Cacheable generated system output | Rebuild/validate after SEO/redirect/public route changes |
| Provider calls | Asynchronous or bounded server call with timeout/retry | Do not block/succeed falsely; show pending/recovery state |

## 4. Image and media performance

- Define image dimensions/roles in media metadata to avoid layout shift.
- Generate/use responsive derivatives through the future media pipeline.
- Prioritize LCP product/hero image only when approved content/media exists; avoid unnecessary eager loading.
- Defer non-critical gallery/editorial media and avoid shipping full originals to every viewport.
- Cache media through an object-storage/CDN delivery layer selected later.
- Preserve accessibility alt/caption and rights metadata while optimizing delivery.
- Treat missing/oversized/broken media as catalog/content quality defects, not visual-only issues.

## 5. Database and query performance

- Use relational query patterns aligned with approved access paths for product/category/article/order/admin work.
- Avoid N+1 route data access through application query/read-model design.
- Use transaction scope narrowly; never hold database locks during long provider/network calls.
- Use indexed/allowlisted search/filter/sort queries after Phase 4 data architecture selects physical indexes.
- Paginate bounded list endpoints/admin queues; never load unbounded catalog/order/content/media histories.
- Monitor slow query, lock contention, connection saturation, failed transaction, queue backlog, and inventory conflict signals.

No index design, connection pool value, database size, traffic projection, or benchmark is invented here.

## 6. Search and checkout performance

### Search

- Normalize/bound query length and scopes.
- Use lightweight result payloads and limit autocomplete result count.
- Use debounce/client behavior only as an enhancement; server search remains rate-limited and correct.
- Separate search indexing from interactive query path through durable updates/read model.

### Checkout

- Validate local/server state efficiently but do not skip authoritative inventory/price/shipping/payment checks.
- Avoid synchronous polling or long provider wait as a success condition.
- Use pending/processing state and worker/webhook reconciliation for slow provider outcomes.
- Preserve user form/cart context during retry/recovery.

## 7. Performance observability

Collect/monitor, under approved privacy policy:

- Core Web Vitals by public route class;
- server/render/cache timings and error rates;
- database query/lock/connection signals;
- search latency/zero-result/index freshness;
- cart/checkout mutation latency and validation/conflict rates;
- payment/shipping provider latency/timeout/error classes;
- worker queue depth/latency/retry/failure;
- media load/optimization/broken-asset signals;
- admin task route performance.

Do not collect unnecessary PII or use session replay/behavioral profiling by default.

## 8. Performance validation gates

Before production, establish actual device/network/traffic assumptions, route budgets, synthetic tests, representative catalog/media data, cache behavior, provider sandbox behavior, load/concurrency tests for checkout/inventory/webhooks/jobs, and regression thresholds. The targets in this document are proposed gates to validate, not evidence of current performance.
