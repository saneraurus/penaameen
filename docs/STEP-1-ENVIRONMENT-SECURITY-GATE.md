# Step 1 Environment and Security Gate

**Status:** IMPLEMENTED LOCALLY; staging verification required.

## Scope

Step 1 establishes the minimum gate before provider sandbox testing or new Admin modules:

- configuration presence is reported without exposing secret values;
- production core configuration fails readiness when missing;
- browser mutation origins are checked against `APP_BASE_URL` and optional `TRUSTED_ORIGINS`;
- server-to-server calls without browser origin headers remain available to authenticated or signed routes;
- readiness and security behavior have automated unit coverage.

## Readiness states

`GET /api/v1/health` returns a no-store response with a safe `readiness` report:

| State | Meaning |
|---|---|
| `ready` | All checks in the evaluated environment are configured. Provider reachability still requires explicit sandbox health tests. |
| `unknown` | Core runtime is not blocked, but optional provider/catalog configuration is incomplete. |
| `blocked` | Required production configuration is missing. The endpoint returns HTTP `503`. |

The report contains only check IDs, state, required flag, and safe detail text. It never returns URLs containing credentials, API keys, tokens, or secret values.

## Required production configuration

- `APP_ENV=production`
- `APP_BASE_URL`
- `DATABASE_URL`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Provider-specific configuration is optional at this gate and must be verified through the existing Admin integration health checks before being marked operational.

## Origin protection

Cookie-authenticated Admin mutation routes call `requireRequestOrigin` before performing privileged work. The allowed browser origins are:

- the origin from `APP_BASE_URL`;
- origins listed in `TRUSTED_ORIGINS`, comma-separated.

Requests without `Origin` or `Referer` are treated as non-browser calls and continue to rely on route authentication or webhook signature validation. Requests with an untrusted browser origin fail closed.

## Staging acceptance checklist

1. Provide isolated staging values through the approved secret manager, never source control.
2. Confirm `GET /api/v1/health` is `200` or intentionally `503` with the expected safe readiness report.
3. Confirm a legitimate staging Admin mutation succeeds from the configured origin.
4. Confirm the same mutation from a foreign origin is rejected before the business operation.
5. Confirm webhook/server-to-server requests do not require browser origin headers and still require their signature/authentication controls.
6. Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
7. Record provider sandbox results separately for Clerk, Casaku, Midtrans, RajaOngkir, Google Sheets, Resend, and AI providers.

## Not covered by this step

- provider network reachability or credentials;
- database migration/restore testing;
- browser Playwright E2E journeys;
- full CSRF token protocol for providers that require cross-origin browser embedding;
- production deployment, DNS, backups, or monitoring ownership.
