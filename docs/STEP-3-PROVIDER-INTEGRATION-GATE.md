# Step 3 Provider Integration Gate

**Status:** Local adapter and E2E checks complete; provider acceptance remains explicit per provider.

## Local validation

- Clerk discovery endpoint reachable in the configured development instance.
- Casaku profile endpoint reachable and returned an API success envelope during the local probe.
- Groq model endpoint reachable during the local probe.
- NVIDIA model endpoint reachable during the local probe.
- Google Sheets service-account file exists locally.
- Database runtime is active locally.
- Provider configuration readiness rejects placeholders such as `...`, `REDACTED`, `your_*`, and `placeholder` values.

## Provider status rules

Configuration presence is not provider verification. A provider is operational only after its adapter health check or sandbox transaction succeeds.

| Provider | Local result | Status |
|---|---|---|
| Clerk | Development discovery endpoint reachable | CONNECTIVITY VERIFIED; authenticated staff flow still staging-gated |
| PostgreSQL | Local runtime active | VERIFIED LOCALLY |
| Casaku | Profile API success envelope returned | CONNECTIVITY VERIFIED; payment generation/subscription transaction still required |
| Groq | Models endpoint reachable | CONNECTIVITY VERIFIED; chat completion/cost/limits still required |
| NVIDIA | Models endpoint reachable | CONNECTIVITY VERIFIED; chat completion/cost/limits still required |
| Google Sheets | Service-account file present | CONFIGURED; spreadsheet read/write verification required |
| Midtrans | Local values are placeholders/redacted | BLOCKED |
| RajaOngkir | No effective local API key | BLOCKED |
| Resend | No effective local API key | BLOCKED |

## Local run result

- `npm run check`: passed.
- `npm run test:e2e`: **7 passed**.
- Local health endpoint: `HTTP 200`, secret-safe response.
- Untrusted Admin origin: `HTTP 403` before Clerk authentication.
- Trusted signed-out Admin origin: reaches normal Clerk protection.

The local environment is not an all-provider-success environment. Midtrans, RajaOngkir, and Resend remain blocked by placeholder/missing effective credentials and must not be marked connected.

## Required staging acceptance

1. Rotate any credentials that have been exposed in local files or tooling sessions.
2. Supply non-production sandbox values through the secret manager.
3. Run read-only provider health checks from Admin settings.
4. Execute a controlled Midtrans sandbox transaction and webhook.
5. Execute a controlled Casaku QRIS generation/status/webhook flow after subscription and quota are active.
6. Request a real RajaOngkir rate using verified origin, destination, and package weight.
7. Verify Google Sheets read, append, update, and movement-ledger behavior.
8. Verify Resend sender/domain and delivery to a controlled test mailbox.
9. Verify Clerk sign-in, org membership, role claims, webhook sync, and staff authorization.
10. Verify Groq/NVIDIA completion response shape, timeout, quota, and redaction behavior.
