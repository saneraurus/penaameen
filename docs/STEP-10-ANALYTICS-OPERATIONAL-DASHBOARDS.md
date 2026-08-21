# Step 10 Analytics and Operational Dashboards

**Status:** Local operational dashboard implementation complete; external analytics governance remains pending.

## Dashboard sources

`/admin/analytics` and `GET /api/admin/analytics` now combine:

- PostgreSQL order status counts.
- Paid order count and total from authoritative order records.
- Seven-day order creation trend.
- Customer count.
- Active products with zero stock.
- Unread and critical unread notifications.
- Content/SEO, gallery, redirect, and notification health.

These are operational read models. They do not change commerce state and do not claim marketing attribution, conversion, or customer behavior measurement.

## Unknown policy

Conversion, analytics-provider KPIs, and marketing metrics remain `UNKNOWN` until provider, consent, retention, KPI, and reporting ownership decisions are approved.

## Acceptance

```text
npm run check
npm run test:e2e
```
