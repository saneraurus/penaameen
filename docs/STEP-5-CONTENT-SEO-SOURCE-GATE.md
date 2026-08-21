# Step 5 Content and SEO Source Gate

**Status:** Local implementation complete; legacy branch outlet migration and crawler validation remain explicit blockers.

## Implemented

- Public article list and detail read active records from Prisma through `src/lib/content.ts`.
- Public branch API reads active branch records from Prisma.
- Assistant knowledge refreshes articles, branches, and methods from live content readers before building its prompt.
- Active-only filters prevent inactive articles/branches from being publicly resolved.
- `sitemap.xml` is generated from active product/content routes.
- `robots.txt` protects Admin/API/order/checkout paths and points to the generated sitemap.
- Admin SEO consumes database-backed counts and clearly marks structured data/redirects as `unknown` or `blocked` where no evidence exists.

## Known blockers

- Prisma `Branch` does not model the legacy `outlets` array used by the old branch UI. Outlet migration needs an approved schema/content decision; no outlet data was silently discarded.
- Gallery content remains static because no approved media model/source exists.
- Structured data requires crawler/search-console validation.
- Redirect inventory requires an approved migration source before implementation.

## Acceptance

```text
npm run check
npm run test:e2e
```
