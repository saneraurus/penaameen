# PENA AMEEN Security Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory security rules. This is not a compliance claim, security configuration, audit result, penetration test, or provider selection.

## 1. Mandatory protections

| Threat | Mandatory constitution rule |
|---|---|
| XSS | Escape output by context; sanitize approved rich content; avoid raw HTML; use CSP/security-header posture after deployment selection; never trust content/provider input |
| CSRF | Protect state-changing browser requests with approved session/origin/token policy; Server Actions/APIs share explicit protection model |
| SQL injection | Use validated/parameterized data access; allowlist filters/sorts; no raw user-controlled query construction |
| SSRF | Disallow arbitrary server URL fetch; use provider adapters, allowlists, safe parsing, network/response limits |
| Open redirect | Allowlist/validate redirect targets; legacy redirects only from approved Redirect records |
| Unsafe upload | Verify MIME/signature/size, quarantine/scan, safe object keys, access class, rights state; no executable path delivery |
| Malicious webhook | Isolated route, signature/timestamp/replay/schema/account validation, idempotent receipt, quarantine invalid events |
| Replay/duplication | Scoped idempotency for commands/events; duplicate/out-of-order events cannot repeat money/stock/shipment/message effect |
| Brute force/enumeration | Rate limit auth/recovery/tracking/search/admin sensitive paths; generic safe denial/recovery responses |
| Credential leakage | Server/worker-only secret access; never commit/log/render/embed secret values |
| PII leakage | Data minimization, ownership/capability checks, redacted logs/analytics/errors, private cache/indexing policy |
| Log leakage | Structured safe fields only; no raw provider payload/payment credential/session/address/message body by default |

## 2. Session, cookie, and headers rules

- Future browser sessions use secure, HTTP-only, same-site posture appropriate to selected host/origin model.
- Session identifiers are revocable/rotated according to approved security policy.
- Security headers, frame/embed policy, content security policy, transport security, and trusted origins are configured only after deployment decision, but must be planned and tested before production.
- No private route may rely on hidden UI or client storage for protection.

## 3. Secret and encryption expectations

- Secrets live only in approved environment secret management, scoped by environment/service/adapter.
- No secret is committed, copied to documentation, returned by API, placed in client bundle, or logged.
- Protect confidential/financial/security data in transit and at rest using selected platform controls; exact algorithm/provider/legal obligations remain unresolved.
- Rotation, incident revocation, backup protection, and access review are mandatory operating requirements before production.

## 4. Payment, shipping, media, and migration boundaries

- Payment/shipping adapters receive minimum data and verify external evidence; provider contracts never bypass authorization/state/audit.
- Media rights/private labels/documents use explicit access/lifecycle and no public source-path assumption.
- Migration imports use staged non-production validation, source preservation, quarantine, rollback/reconciliation; never mutate source data without approval.
- SEO redirects cannot become an open redirect endpoint.

## 5. Security verification

Future implementation must test authorization/ownership, CSRF, XSS/rich content, SSRF/redirect, upload validation, webhook signature/replay, idempotency, secret scanning, logging redaction, rate-limit/enumeration, backup/restore, and incident/recovery behavior. No feature is secure merely because it uses a library.
