# PENA AMEEN Security Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED security boundary and control blueprint. It does not claim compliance certification, penetration-test results, PCI compliance, legal compliance, specific providers, secret values, or implemented controls.

## 1. Security objectives

Protect customer, staff, order, payment, shipping, media, SEO, and operational data while preserving a usable ecommerce journey. Security controls must not create hidden provider assumptions or make a browser/client the authority for sensitive state.

## 2. Trust zones

| Zone | Assets | Required boundary |
|---|---|---|
| Public browser/crawler | Public content, catalog, search, cart UI | No secrets/private data; server validates every mutation |
| Customer session | Cart, checkout, account/order/tracking access | Secure session/ownership/CSRF/rate-limit controls |
| Staff/admin session | Catalog, orders, payment/shipping operations, customer data | Stronger capability/audit/session controls; least privilege |
| Web runtime | Server rendering, API, webhook ingress | Server-only secrets/data access; input/output controls |
| Worker | Jobs, retries, provider reconciliation | Restricted service identity; idempotent job processing |
| PostgreSQL | Commerce/content/audit/session data | Network/access encryption, role separation, backup/recovery controls |
| Object storage | Media/documents/labels | Upload validation, private/public access separation, signed access as needed |
| Provider adapters | Payment, shipping, email, analytics, search | Secret isolation, outbound validation, availability/retry controls |
| Observability | Logs/traces/metrics/audits | Redaction, access control, retention, no secret/PII leakage |

## 3. Authentication and session security

- Use server-managed/revocable sessions; browser stores only secure session identifier material.
- Use secure, HTTP-only, same-site cookie posture appropriate to final deployment and cross-origin needs.
- Rotate/revoke sessions after login/recovery/security/staff access changes under approved policy.
- Separate customer/staff authorization context and elevate staff-sensitive actions only through capability checks.
- Protect login, registration, recovery, tracking/order lookup, and session endpoints with rate/abuse controls.
- Use generic recovery responses where account existence is sensitive.
- Authentication provider, password policy, MFA, SSO, account migration, and session duration are deferred/client-gated.

## 4. Authorization and admin security

- Enforce resource ownership for customer/cart/order/address/tracking access.
- Enforce capability checks inside application services for admin actions.
- Require audit records for price, inventory, product/category/content/SEO publication, redirect, shipment, refund, access, and sensitive customer-data actions.
- Prohibit staff self-escalation; access changes require approved access administration workflow.
- Restrict finance/payment/reconciliation/refund actions separately from generic order viewing.
- Limit customer PII access to purpose/role; log sensitive access where policy requires.
- Super-admin/emergency access is deferred until client security operations approves it.

## 5. Web application controls

| Threat | Proposed control boundary |
|---|---|
| CSRF | Same-site session posture plus CSRF token/origin validation for state-changing browser requests; Server Action/API use must follow one approved policy. |
| XSS | Framework escaping plus contextual output encoding, rich-content sanitization, CSP strategy, safe URL handling, no untrusted HTML/script injection. |
| SQL injection | Parameterized/query-library data access and allowlisted dynamic filters/sorts; no raw user-controlled SQL. |
| SSRF | No arbitrary server URL fetch; allowlist/provider adapters, URL parsing, network egress constraints, and response limits. |
| Open redirect | Redirect allowlist/relative path validation; legacy redirects come only from approved registry. |
| Broken access control | Service-layer ownership/capability checks; private routes non-indexable; generic safe errors. |
| Mass assignment | Explicit command DTOs/allowlists; no generic entity update endpoint. |
| File upload abuse | MIME/signature/size validation, quarantine/scanning, safe object keys, no executable uploads. |
| Clickjacking | Frame embedding policy determined in deployment/security headers. |
| Dependency supply chain | Lock/dependency review, SBOM/vulnerability scanning in future CI; no dependencies added in Phase 3. |

## 6. Payment and shipping security

- Provider secrets are server/worker-only and scoped by environment.
- Webhooks verify signature, timestamp/replay, configured account/source, schema, and idempotency.
- Browser return/callback is not a payment success authority.
- Payment records do not store raw payment credentials; PCI responsibilities are unknown and must not be claimed.
- Shipping label/tracking/destination data is limited to authorized customer/staff contexts.
- Provider outbound requests use adapter-level validation, timeouts, retry policy, correlation, and redacted logging.

## 7. PII, data classification, and privacy

| Class | Examples | Controls |
|---|---|---|
| Public | Published product/article/category/approved branch data | Integrity, publish/SEO controls |
| Internal | Catalog drafts, operational metrics, redirect work | Staff capability and audit controls |
| Confidential PII | Name, email, phone, address, account/session identifiers | Minimize, encrypt/protect in transit/at rest by platform policy, capability access, redacted logs |
| Financial operational | Payment references, refund/reconciliation records | Finance capability, redaction, audit, retention policy |
| Secret | API keys, signing keys, database credentials, session keys | Environment secret manager, least privilege, rotation, never log/client expose |
| Legal/rights | Media ownership, consent, testimonial approval | Restricted access, audit, lifecycle policy |

Retention, consent, deletion/export, encryption standards, key management, legal jurisdiction, privacy policy, and breach response require client/legal/security confirmation.

## 8. Logging, audit, backup, and recovery

- Structured logs redact secrets, credentials, raw payment data, and unnecessary PII.
- Audit logs capture sensitive change context but are access controlled and tamper-resistant conceptually.
- Backups must be encrypted/protected, tested for restoration, access restricted, and aligned with data retention/legal policy.
- Disaster recovery/incident response require owner, runbook, recovery objectives, notification policy, and periodic test; exact RTO/RPO targets are not yet approved.
- Security incidents/provider compromise require secret rotation, session revocation, audit investigation, and safe customer/staff communication plans.

## 9. Security verification gates

Before production, later phases must provide:

- threat model and attack-surface review;
- authorization/ownership tests;
- webhook/idempotency/replay tests;
- input/file/upload/redirect/SSRF/XSS/CSRF controls verification;
- dependency and secret scanning;
- audit/log redaction review;
- backup/restore and incident response tests;
- provider security/compliance review;
- privacy/legal policy and data-flow approval.

## 10. Explicit non-claims

This document does not claim PCI DSS, ISO certification, legal compliance, pentest completion, encryption configuration, MFA, WAF, DDoS provider, secret-manager provider, managed backup provider, or successful security testing. Those require actual selected services, implementation, legal review, and validation.
