# PENA AMEEN Data Security and Privacy Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED data-classification and handling blueprint. It does not claim legal compliance, prescribe encryption products/algorithms, establish retention periods, or create security configuration.

## 1. Data classification

| Classification | Logical data | Handling expectations | Access boundary |
|---|---|---|---|
| Public | Published product/article/category/page/approved branch/event SEO data | Integrity, publication, SEO, media-rights controls | Public read only when published/indexable |
| Internal operational | Draft catalog/content, inventory health, job state, redirect work, safe analytics aggregates | Authorized staff/module access, audit where sensitive | Capability/service boundary |
| Confidential PII | Customer name, email, phone, address, consent, session/security metadata | Minimize, protect in transit/at rest through selected platform controls, redact from logs/analytics | Customer ownership or justified staff capability |
| Financial operational | Order monetary snapshots, payment references, refunds, settlements | Finance/order capability, audit, no raw credential storage | Finance/order service and authorized staff |
| Shipping sensitive | Recipient address/contact, tracking/shipment/label details | Minimize public exposure; private label/document handling | Customer ownership/approved lookup or fulfillment/support role |
| Security sensitive | Session identifiers, authentication references, idempotency keys, webhook evidence | Server/worker-only where applicable; redaction/rotation/access control | Identity/platform/security boundary |
| Secret | Provider credentials, database credentials, signing keys | Environment secret manager only; never data entities/logs/client code | Restricted server/worker deployment context |
| Rights/legal | Media ownership, testimonial consent, policy versions, audit evidence | Restricted legal/content access; immutable evidence history | Approved content/legal/security roles |

## 2. Data access boundaries

| Data class | Public | Customer/guest | Staff | Worker/system | External provider |
|---|---|---|---|---|---|
| Published catalog/content/SEO | Approved read | Approved read | Approved edit by capability | Index/cache processing | Only derived/approved data where needed |
| Cart/order/tracking | No public enumeration | Own/approved lookup only | Purpose/capability limited | Process source event only | Provider-neutral reference/minimum data |
| Customer PII | No | Own approved data | Minimum necessary, audited as policy requires | Only job-required fields | Minimum contractual data only |
| Payment references/refunds | No | Customer-safe status only | Finance/order authority | Reconciliation/job scope | Provider adapter only |
| Shipping labels/address | No | Own approved tracking/status; label only if policy allows | Fulfillment/support authority | Shipment job scope | Shipping adapter only |
| Audit/security records | No | No default | Restricted administrator/security capability | Append/process only | Never shared by default |
| Secrets | Never | Never | Never through application UI | Server/worker environment only | N/A |

## 3. Encryption and transport expectations

- Protect confidential/financial/security data in transit and at rest using capabilities selected with the final platform/database/storage providers.
- Separate public media delivery from private documents/labels and sensitive object access.
- Use server-side managed secrets for provider/database/session signing configuration; do not put secrets in logical data records, browser payloads, logs, or analytics.
- Design key rotation, backup protection, access review, and incident recovery with platform/security owners later.

Exact algorithms, key management service, hosting region, compliance obligations, and data residency are `UNKNOWN`/client decisions.

## 4. Logging and analytics restrictions

- Structured logs/audit/analytics must avoid raw password, session, secret, full payment credential, full webhook payload, full address, unnecessary contact data, and unapproved message content.
- Use safe references/correlation IDs and aggregate/bucket values where possible.
- Audit evidence may contain sensitive context but requires access controls and retention policy.
- Search/analytics query retention, customer identity linking, revenue/order forwarding, and third-party tracking require consent/legal decisions.

## 5. Retention, deletion, export, backup, recovery

| Area | Current policy | Architectural handling |
|---|---|---|
| Customer/profile/address/consent | UNKNOWN | Retention/deletion/export/anonymization workflow must be policy-driven and preserve required order/audit evidence appropriately |
| Orders/order items/addresses | UNKNOWN | Preserve historical snapshots; legal/finance retention and anonymization policy required |
| Payments/refunds/settlements | UNKNOWN | Retain minimal financial evidence under finance/legal policy; never raw credentials |
| Shipments/tracking/labels | UNKNOWN | Retain operational evidence/private artifacts under policy; access restricted |
| Audit logs | UNKNOWN | Append-only audit evidence with restricted access; legal/operational retention decision required |
| Analytics/notifications | UNKNOWN | Minimize payload; expire/delete under consent/retention policy |
| Media/content | UNKNOWN | Rights/consent/archival/publication state governs visibility and lifecycle |
| Backups | UNKNOWN | Encrypted/protected backup/restore strategy and test required before production |

## 6. Privacy and legal decisions

Privacy policy, terms, consent language, legal basis, retention, deletion/export, data controller/processor roles, breach/incident communication, regional requirements, and audit access are `CLIENT DECISION REQUIRED`. Architecture keeps the necessary data boundaries visible but does not claim compliance or define policy values.
