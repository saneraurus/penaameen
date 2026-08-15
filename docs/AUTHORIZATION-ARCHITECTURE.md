# PENA AMEEN Authorization Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED authorization model. Customer/staff identities, exact roles, authentication provider, permission records, approval thresholds, and account migration remain client/architecture decisions. No authentication or RBAC implementation is created.

## 1. Authorization principles

- Authentication proves or establishes an identity/session; authorization decides whether that actor may perform an action on a resource.
- Route access is not sufficient; application services enforce ownership/capability on every protected command/read.
- Least privilege, separation of duties, sensitive-action audit, and safe customer data boundaries apply by default.
- The public/guest/customer/staff/admin distinction follows Phase 1 role needs without treating every role as a separate login type.
- One staff identity may have multiple proposed capability bundles; final combinations require client approval.

## 2. Actor model

| Actor | Purpose | Baseline access | Status |
|---|---|---|---|
| Public visitor | Browse published public content/catalog and use public utility entry points | Only approved public routes/data | CONFIRMED requirement |
| Guest customer | Maintain a permitted cart/checkout and approved tracking/order lookup | Session-bound cart; minimum post-purchase access under future policy | CLIENT DECISION REQUIRED for guest policy |
| Authenticated customer | Access own approved profile, addresses, orders, tracking | Customer-owned resources only | PROPOSED; account feature conditional |
| Staff | Perform one or more operational capability bundles | Capability-scoped internal/admin resources | PROPOSED; final staff roles unknown |
| Administrator | Manage approved settings/access and cross-domain operations | Broad but not automatically unrestricted financial/PII access | PROPOSED |
| Super Admin | Emergency/system-level access if PENA AMEEN approves it | Minimal number of highly audited, time-bounded powers | CLIENT DECISION REQUIRED; do not assume role exists |
| Worker/system | Process durable jobs and verified provider events | Service identity restricted to job/provider scope | PROPOSED technical actor |
| External provider | Send validated webhook events only | No admin/customer session access | CONFIRMED boundary; provider unknown |

## 3. Proposed staff capability bundles

These are capabilities, not confirmed job titles or separate authentication roles.

| Capability bundle | Main resources/actions | Explicit restriction |
|---|---|---|
| Catalog management | Products, categories, media assignment, product SEO, approved inventory visibility | Cannot bypass publish/price/inventory/SEO approval policy once defined |
| Content management | Articles, pages, content taxonomy, media, internal links, draft/publish workflow | Cannot retire migration-sensitive route without SEO/redirect review |
| Order operations | Order queue/detail, customer order context, status progression under policy | Cannot mark payment paid or refund without authoritative state/permission |
| Fulfillment/shipping | Eligible fulfillment, shipment creation, AWB/label/tracking operations | Cannot override origin/package/provider policy or create duplicate shipments |
| Finance/payment review | Payment/reconciliation/refund review | Cannot see raw payment credentials or perform refunds without approved authority |
| Customer support | Authorized customer/order/tracking context and support notes if approved | Cannot access unrelated customers, credentials, or unrestricted payment data |
| SEO management | Metadata/canonical/indexability/redirects/sitemap validation | Cannot discard source URL/content without documented migration decision |
| Analytics/reporting | Approved aggregate reports and operational metrics | Cannot bypass consent/PII/data-retention controls |
| Access administration | Staff account/capability assignment under approved process | Cannot silently self-escalate or evade audit |

## 4. Resource ownership rules

| Resource | Ownership rule | Authorization requirement |
|---|---|---|
| Cart | Guest session or authenticated customer association | Caller must possess valid current session/cart context; no arbitrary cart ID access |
| Customer profile/address | Customer identity owns own record; staff access is purpose-limited | Customer ownership or staff capability + business need |
| Order | Customer may access only own authorized order; staff access by capability | Customer ownership/approved guest lookup; staff order/support capability |
| Payment | Order/payment aggregate; provider events only via verified adapter | Customer receives limited status; finance/order roles access approved context |
| Shipment/tracking | Order/shipment aggregate | Customer ownership/approved lookup; fulfillment/support staff capability |
| Product/category/content | Public read only when published/eligible | Staff edit/publish capability; public cannot see draft/private fields |
| SEO/redirect | Organization-owned migration-sensitive resource | SEO capability plus approval/audit policy for risky changes |
| Media | Organization-owned but rights-constrained | Media/content/catalog capability; upload/access validation |
| Admin user/role/permission | Organization security resource | Access administration; super-admin policy if approved |
| Audit log | Security/operations record | Read restricted; append through audited system/action paths only |

## 5. Sensitive actions

| Action | Proposed actor/capability | Additional controls |
|---|---|---|
| Change price/sale price | Authorized catalog staff | Audit; optional approval threshold is client decision |
| Adjust inventory | Authorized catalog/operations staff | Reason, actor, before/after audit; reconciliation policy |
| Archive/delete product/category/content | Authorized owner plus SEO review where public/migration-sensitive | Redirect/content impact warning and audit |
| Create/cancel shipment | Fulfillment capability | Order eligibility, idempotency, audit, provider/SOP validation |
| Print/retrieve label | Fulfillment capability | Shipment ownership/status and audit |
| Mark/refund payment | Finance/order authority | Verified provider evidence, approved refund authority, audit |
| View customer PII | Support/order/fulfillment capability with purpose | Least data necessary; access logging/retention policy |
| Edit redirect/canonical/indexability | SEO capability | Source/target validation, audit, approval process |
| Manage staff access | Access administrator | No self-escalation; audit; optional dual control |
| View audit/security logs | Restricted administrator/security capability | No alteration; privacy-sensitive access |

## 6. Session architecture

### Proposed baseline

- Use secure, server-managed, revocable session records or opaque session identifiers.
- Store browser session identifiers in secure, HTTP-only, same-site cookies; exact cookie attributes/expiry and session store are later security decisions.
- Rotate/revoke sessions on approved authentication/recovery/security events.
- Separate customer and staff session assurance/policy even if a common identity mechanism is used.
- Do not rely on local storage bearer tokens for privileged browser access.

### Deferred/unknown

- Authentication provider/library, password policy, MFA, staff SSO, identity verification, password migration, account activation, lockout rules, support recovery, and legal retention are not confirmed.

## 7. Guest and order lookup boundaries

Guest checkout and public tracking are required outcomes, but their authorization design is unresolved. A future implementation must define safe proof/verification factors, request limits, response minimization, expiry, notification links, and support escalation before exposing order/tracking data.

No route may assume that an order reference alone grants access.

## 8. Audit requirements

Sensitive staff/system actions require audit context containing at least actor class/ID, action, target, safe before/after summary or version, outcome, reason when needed, correlation ID, and timestamp. Exact retention, visibility, export, and legal policy are client/security decisions.

## 9. Status and client decisions

- Customer account creation/login and guest checkout: `CLIENT DECISION REQUIRED`.
- Customer/historical-order migration: `CLIENT DECISION REQUIRED`.
- Final staff roles, capability combinations, approval thresholds, and manual overrides: `CLIENT DECISION REQUIRED`.
- Super Admin role: `DEFERRED` unless a clear operational/security need is approved.
- Provider webhook actor: technical boundary confirmed; exact provider identity/validation is `UNKNOWN`.
