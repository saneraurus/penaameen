# PENA AMEEN Admin Operational Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED operations architecture aligned to the 24 private admin destinations. It does not create admin UI, permissions, dashboards, reports, integrations, or staff accounts.

> **SUPERSEDED (2026-08-17, D010):** The approved Admin Control Center specification
> (`PENA_AMEEN_ADMIN_ARCHITECTURE.md` v1.0) supersedes this document where they
> conflict. Implementation follows `docs/ADMIN-CONTROL-CENTER-PLAN.md`. This
> document remains valid as background for the operating boundary and manual
> fallback design.

## 1. Admin architecture objective

Admin operations use the same domain services and authoritative records as public commerce. Admin routes expose capability-gated task read models and commands; they do not bypass state machines, provider abstractions, audit, or migration/SEO safety controls.

## 2. Admin operational domains

| Admin domain | Primary route family | Core architecture boundary | Automation posture |
|---|---|---|---|
| Dashboard/work queues | `/admin/` | Aggregate approved order/payment/shipping/catalog/SEO exception signals | HYBRID |
| Products/catalog | `/admin/products/*`, `/admin/catalog/*` | Catalog service, media, inventory, SEO/redirect review | HYBRID |
| Inventory | `/admin/inventory/` | Inventory service/adjustment/audit/reconciliation | HYBRID |
| Orders | `/admin/orders/*` | Order state machine/customer/order snapshot | HYBRID |
| Payment review | `/admin/payments/` | Payment service, verified events, reconciliation/refund policy | HYBRID / BLOCKED by provider policy |
| Fulfillment/shipping | `/admin/fulfillment/` | Shipping service, package, shipment/AWB/label/tracking workflow | HYBRID / BLOCKED by provider/SOP |
| Customers | `/admin/customers/*` | Customer/profile/order-support data with PII restrictions | MANUAL/HYBRID |
| Content/taxonomy | `/admin/content/*` | Content lifecycle, media, internal-link, SEO route validation | HYBRID |
| SEO/redirects | `/admin/seo/*` | Metadata/canonical/indexability/redirect governance | HYBRID |
| Media | `/admin/media/` | Media validation, rights, storage/reference lifecycle | HYBRID |
| Branches/events | `/admin/branches/`, `/admin/events/` | Conditional content/local/community records | MANUAL/HYBRID / CLIENT DECISION REQUIRED |
| Promotions | `/admin/promotions/` | Conditional commercial rule configuration | MANUAL/HYBRID / CLIENT DECISION REQUIRED |
| Analytics | `/admin/analytics/` | Aggregate privacy-safe events and operational metrics | AUTOMATED collection; manual interpretation |
| Settings/access | `/admin/settings/*` | Approved configuration and capability assignments | MANUAL with audit |
| Audit logs | Capability-scoped operational/security views | Append-only audit records | AUTOMATED capture; manual review |

## 3. Automated, manual, and hybrid operations

### Automated

- Create durable outbox records after committed domain events.
- Process valid notification, search-index, media, sitemap, tracking, and reconciliation jobs.
- Deduplicate/validate webhooks and update only allowed normalized state.
- Derive dashboard/work-queue candidate counts from authoritative records.
- Generate safe audit/event metadata and error/health signals.

### Manual

- Approve source data/import reconciliation and catalog readiness.
- Supply/approve product package, inventory, price, promotion, and taxonomy policy.
- Review unmatched payment events, provider settlement discrepancies, shipment exceptions, returns, and legal/customer-support cases.
- Approve content claims, media rights, redirects, route retirement, branch/event data, staff roles, settings, and policy changes.
- Resolve a provider outage when automated retry cannot safely proceed.

### Hybrid

- Product publication: automated validation plus authorized human publish/approval process.
- Inventory adjustment: system records/applies valid adjustment; staff supplies reason/source and resolves discrepancy.
- Payment: provider event drives status; authorized finance staff resolves exceptions/refunds under policy.
- Shipping: adapter executes valid call; staff validates package/handoff/label/manual fallback.
- Content/SEO: system validates route/meta state; staff approves publish/redirect decisions.
- Notifications: event queues automatically; staff handles failed/exception communication.

## 4. Admin command architecture

Every privileged command follows this path:

```text
Admin route intent
→ staff session and capability check
→ input/state validation
→ application-service transaction
→ domain transition or data update
→ audit record + durable outbox intent
→ response with authoritative state
→ worker/provider follow-up if needed
```

Examples:

| Command | Preconditions | Transactional effect | Worker/provider follow-up |
|---|---|---|---|
| Publish product | Catalog capability; complete approved data; URL/SEO checks | Product/publication state and audit | Search/sitemap/cache update |
| Archive product | Capability; legacy/SEO treatment confirmed | Product lifecycle state; redirect/outbox audit | Search/sitemap/cache update |
| Adjust stock | Inventory capability; reason/source | Adjustment/available stock/ledger audit | Exception/low-stock signal if approved |
| Move order to packed | Fulfillment capability; paid/eligible state | Order/fulfillment transition audit | Optional notification/work queue |
| Create shipment | Fulfillment capability; package/selected service | Shipment request intent/audit | Shipping provider adapter/job |
| Review payment/refund | Finance authority; verified evidence/policy | Payment/refund state/audit | Provider call/reconciliation/notification |
| Publish article/page | Content capability; media/SEO/route checks | Content state/audit | Search/sitemap/cache update |
| Add redirect | SEO capability; source/target validation | Redirect record/audit | Redirect validation/sitemap monitor |
| Change staff access | Access admin capability; approved process | Role/capability assignment/audit | Session revocation/alert if required |

## 5. Manual fallback architecture

| Failure | Manual fallback path | Required guardrail |
|---|---|---|
| Payment provider event unmatched | Finance/order exception queue | No manual paid state without approved evidence; audit resolution |
| Shipping quote/provider unavailable | Hold/retry/manual support workflow | No invented rate or shipment status |
| Shipment/AWB/label failure | Fulfillment exception queue; approved manual entry only if policy permits | Idempotency, evidence, staff capability, audit |
| Tracking stale/unavailable | Customer-safe status/support path; staff review | Do not imply delivery status |
| Email/channel delivery failure | Notification exception queue/support workflow | Respect consent and avoid duplicate message |
| Inventory discrepancy | Reconciliation/adjustment process | Reason, source, before/after audit |
| SEO/redirect conflict | SEO review queue | No publish/route retirement until validated |
| Media rights/missing file | Media review queue | Do not publish unapproved asset |
| Database/provider outage | Operational incident path | Preserve authoritative state; retry/recover only per policy |

## 6. Dashboard and work-queue architecture

Dashboard data should surface actionable entities, not invented vanity metrics:

- orders requiring payment review, fulfillment, shipment, tracking, or customer support;
- provider/webhook/reconciliation exceptions;
- inventory/categorization/media/SEO publication blockers;
- redirect/404/sitemap/SEO migration exceptions;
- notification delivery failure queues;
- approved aggregate reports/analytics when governance exists.

Thresholds, SLA timers, financial metrics, staff reporting, and alert ownership remain client decisions.

## 7. Audit and data-minimization requirements

- Every sensitive action receives actor/action/target/outcome/correlation/audit context.
- Admin read access to customer PII, payment data, media rights, and audit logs is capability-limited and logged as appropriate.
- Staff cannot receive raw payment credentials, provider secrets, unrestricted customer data, or unrestricted mutation rights simply because they can view a related admin route.
- Audit records are append-only conceptually; retention/legal access policy remains unresolved.

## 8. Dependencies

Admin implementation is blocked by final staff roles/capabilities, catalog/inventory rules, payment/shipping providers and SOPs, legal/privacy policy, customer migration, promotions, branch/events, reporting needs, source exports, and data architecture. This document defines the operating boundary so later implementation does not have to invent one.
