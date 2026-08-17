# PENA AMEEN Architecture Risk Register

**Phase:** 3 — Technical Architecture

**Status:** Active architecture risk register. Probabilities are qualitative planning assessments based on documented discovery gaps, not measured incident rates. Owners are responsibility categories, not named individuals.

## Risk register

| ID | Priority | Risk | Impact | Probability | Mitigation / architecture response | Owner | Status |
|---|---|---|---|---|---|---|---|
| AR-001 | CRITICAL | Incomplete active product catalog, SKU, price, status, media, variants/packages, weight/dimensions | Incorrect catalog, pricing, inventory, shipping, SEO, and migration loss | High | Require export/source-of-truth, validation gate, source IDs, reconciliation, no invented defaults | Client product + operations | BLOCKED |
| AR-002 | CRITICAL | Incomplete source URL, sitemap, canonical, metadata, schema, robots, internal-link inventory | SEO regression, 404s, lost equity, duplicate routing | High | Preserve/mapping register, redirect validation, source crawl/export/Search Console gate, SEO route architecture | Client SEO + content | BLOCKED |
| AR-003 | CRITICAL | Payment provider/method/account/webhook/refund/settlement unknown | Checkout/payment cannot be implemented/reconciled safely | High | Provider-neutral port, attempt/event/idempotency/reconciliation architecture; block adapter until decision | Client finance + operations | BLOCKED |
| AR-004 | CRITICAL | Shipping provider/courier/origin/package/rate/AWB/label/tracking/returns unknown | Shipping calculation/fulfillment/tracking cannot be implemented safely | High | Provider-neutral port, quote/shipment state, manual-review boundary; block adapter until decision | Client operations | BLOCKED |
| AR-005 | CRITICAL | Source content/media export, rights, and branch/event data incomplete | Broken/missing public content, legal/media risk, migration/SEO loss | High | Media/content migration contracts, rights state, conditional public routes, source-export gate | Client content + legal | BLOCKED |
| AR-006 | CRITICAL | Legal/privacy/terms/shipping/return/refund/consent policies unavailable | Checkout, customer data, notifications, analytics, refunds may be noncompliant/unsupported | High | Policy route/state placeholders only; data minimization/consent architecture; block final flows | Client legal + finance + operations | BLOCKED |
| AR-007 | HIGH | Customer account, guest checkout, order lookup, customer migration, historical order policy unresolved | Privacy/access model and customer self-service cannot be finalized | High | Session/ownership architecture; private route separation; defer implementation until CDR-008/009 | Client product + legal + support | BLOCKED |
| AR-008 | HIGH | Inventory consistency/race conditions and reservation policy undefined | Overselling, incorrect fulfillment, customer dissatisfaction | Medium/High | Transactional availability/reservation architecture, idempotency, audit; require stock/SOP decision | Client operations + architecture | PARTIAL |
| AR-009 | HIGH | Payment webhook duplication, delay, mismatch, or provider outage | Duplicate charge/order state, false paid state, fulfillment error | Medium | Verified receipt/idempotency, state machine, reconciliation queue, provider health/alert design | Architecture + finance | PARTIAL |
| AR-010 | HIGH | Shipping rate/shipment/AWB/tracking provider failures | Failed checkout/duplicate shipment/no tracking/customer support load | Medium/High | Quote/shipment idempotency, retries, exception queues, manual fallback architecture | Architecture + operations | PARTIAL |
| AR-011 | HIGH | SEO migration regression from redirect/canonical/tag/category/hub duplication | Lost organic traffic/indexing, duplicate content, 404s | High | SEO technical architecture, legacy map, route uniqueness, pre/post launch crawl/monitoring gate | SEO + content + architecture | PARTIAL |
| AR-012 | HIGH | Staff roles, permissions, refund authority, SOP, audit requirements unresolved | Unauthorized changes, operational errors, weak accountability | High | Capability architecture, service authorization, audit boundaries; block final permission matrix | Client operations + finance + security | BLOCKED |
| AR-013 | HIGH | Media ownership, image rights, alt text, gallery/testimonial permission unknown | Legal exposure, broken accessibility/SEO/trust assets | High | Rights-aware media lifecycle, quarantine/approval, migration source mapping | Client legal + content | BLOCKED |
| AR-014 | HIGH | External provider outage or degraded service | Payment/shipping/notification/search disruption | Medium | Ports/adapters, timeout/retry/circuit/manual-review/observability architecture | Architecture + operations | PARTIAL |
| AR-015 | HIGH | Data privacy/PII/consent/retention obligations are undefined | Customer/staff data exposure, legal risk, blocked account/analytics | High | Data classification, session/authorization, minimization/redaction, legal gate | Client legal + security | BLOCKED |
| AR-016 | HIGH | Deployment/hosting/DNS/backup/monitoring ownership unknown | Unsafe release/cutover/outage/recovery gap | Medium/High | Environment/deployment blueprint, provider selection gate, backup/rollback/test requirements | Client technical owner + architecture | BLOCKED |
| AR-017 | MEDIUM | Search relevance, language, typo tolerance, synonym scope unknown | Poor discovery/zero results/misleading search behavior | Medium | PostgreSQL-first search port, bounded scopes, CDR-019 before relevance configuration | Client product + content | PARTIAL |
| AR-018 | MEDIUM | Performance/device/network/load expectations not established | Slow public/checkout/admin experience, SEO/conversion risk | Medium | Proposed budgets, SSR/cache/media/query architecture, later measurement/load gate | Architecture + product | PARTIAL |
| AR-019 | MEDIUM | Notification channel/sender/template/consent/fallback unknown | Missing customer communication or duplicate/illegal messages | Medium | Outbox/channel adapter/lifecycle audit; block channel provider implementation | Client support + legal + operations | BLOCKED |
| AR-020 | MEDIUM | Source platform export/backups/plugin/integration knowledge unavailable | Migration transformation/cutover/recovery uncertainty | High | Secure export/backup/system report request; reversible migration plan; no source assumptions | Client technical owner | BLOCKED |
| AR-021 | MEDIUM | Promotion/coupon/tax/price/expiry rules unresolved | Incorrect totals, checkout/user trust issues | Medium | Keep promotion optional; explicit price/revalidation architecture; decision gate | Client finance + product | BLOCKED |
| AR-022 | MEDIUM | Branch/event/gallery retention and local routing uncertain | Orphaned content/local SEO or duplicate pages | Medium | Conditional IA/routes, explicit legacy mapping, source/rights/client decisions | Client content + operations + SEO | BLOCKED |
| AR-023 | MEDIUM | Database/ORM/search/hosting provider choices made before Phase 4 data validation | Costly rework, migration incompatibility, operational lock-in | Medium | Defer implementation libraries/providers; use ports and decision records | Architecture | DEFERRED |
| AR-024 | LOW | Over-engineering with microservices/Kubernetes/external broker too early | Cost/complexity/slow delivery | Medium | Modular monolith, PostgreSQL search/jobs, scale only on measured need | Architecture | MITIGATED by proposed design |
| AR-025 | LOW | Route/architecture documentation drifts from later implementation | Inconsistent system behavior/SEO/operations | Medium | Traceability matrix, decision record, implementation constitution, review gates | Architecture + future engineering | OPEN |

## 2. Critical-blocker summary

Architecture is complete as a blueprint, but implementation remains blocked by AR-001 through AR-006 and dependent policy/SOP decisions. The payment and shipping abstractions reduce future integration risk; they do not resolve provider selection or operational readiness.

## 3. Risk governance

- Critical/high risks require an owner, decision/data request, and validation evidence before implementation/launch gates close.
- A risk can become mitigated only with documented evidence, not an assumption or optimistic status change.
- New provider, source-data, security, migration, performance, or operating-model findings must add/update a risk entry and linked decision record.
- Risk status does not override `PROJECT.md`, client decisions, or migration safety constraints.
