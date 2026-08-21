# Step 8 Analytics and Observability Gate

**Status:** Local privacy-safe foundation complete; analytics provider, consent, KPI, retention, and reporting decisions remain pending.

## Implemented

- Versioned first-party analytics event contract with allowlisted event names.
- Consent state is explicit and defaults to `unknown`.
- Event context is bounded to scalar privacy-safe values.
- `/admin/analytics` and `GET /api/admin/analytics` expose operational health only.
- Orders, revenue, and conversion are never shown as zero when the source/policy is unavailable; they remain `UNKNOWN`.
- Existing content, gallery, redirect, and notification health is reused as first-party operational context.

## Not activated

- No external analytics provider.
- No cookies, pixels, tag manager, session replay, or behavioral profiling.
- No marketing attribution.
- No KPI targets or revenue dashboard claims.

## Required decisions for completion

- Consent/legal policy.
- Analytics provider and environment separation.
- Event retention/deletion/access policy.
- KPI definitions, ownership, and approved aggregate reports.
- Search Console/SEO monitoring access.
- Outbox/job delivery infrastructure for durable domain events.

## Acceptance

```text
npm run check
npm run test:e2e
```
