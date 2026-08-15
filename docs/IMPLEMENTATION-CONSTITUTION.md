# PENA AMEEN Implementation Constitution

**Phase:** 6 — Implementation Constitution & Engineering Governance

**Status:** GOVERNANCE BLUEPRINT. This constitution governs future implementation; it does not authorize provider-specific integrations, source-data migration, production deployment, or implementation that bypasses unresolved client decisions.

## 1. Purpose

This is the primary engineering constitution for future PENA AMEEN implementation agents. It converts the Phase 1–5 product, IA, technical, data, and design contracts into non-negotiable rules for safe development.

## 2. Scope

This constitution applies to all future web runtime, worker runtime, domain, data, integration, configuration, test, migration, documentation, deployment, and review changes. It applies equally to AI and human agents.

## 3. Non-negotiable principles

| Rule | Constitution |
|---|---|
| IC-001 | Read `PROJECT.md`, `AGENTS.md`, relevant control docs, and upstream contracts before changing code, schema, configuration, routes, providers, or migration data. |
| IC-002 | Higher-precedence client/project decisions override lower-level recommendations; unresolved conflict stops dependent work and is documented. |
| IC-003 | Do not invent business rules, provider details, policy, credentials, catalog data, customer data, legal copy, staff authority, or SEO metadata. |
| IC-004 | Preserve single-vendor scope; do not add seller, vendor, payout, marketplace, or multi-vendor capabilities without approved requirements. |
| IC-005 | Preserve migration-sensitive URLs, content, media, metadata, internal links, and redirects; no source URL disappears without documented treatment. |
| IC-006 | Keep payment, shipping, notification, storage, search, authentication, analytics, and monitoring integrations behind approved ports/adapters. |
| IC-007 | Treat customer, order, payment, shipping, audit, media-rights, and secret data as sensitive by default. |
| IC-008 | Server/domain state is authoritative; browser/UI/analytics/provider return alone never decides financial, inventory, fulfillment, authorization, or SEO state. |
| IC-009 | Use the modular-monolith domain boundaries; do not introduce microservices, Kubernetes, brokers, or external search infrastructure without documented approval. |
| IC-010 | A feature is not complete until functional, type, security, accessibility, responsive, SEO, error/recovery, observability, migration, documentation, and review obligations are satisfied. |

## 4. Architecture constraints

| Rule | Constitution |
|---|---|
| IC-011 | Web runtime renders public, account, admin, API, and webhook delivery surfaces; worker runtime handles durable asynchronous work. |
| IC-012 | Delivery adapters call application services; UI, route handlers, Server Actions, jobs, and webhooks do not own domain policy. |
| IC-013 | Application services own use-case orchestration, authorization checks, transaction boundaries, idempotency, audit, and outbox creation. |
| IC-014 | Domain logic does not import provider SDK models; adapters translate between ports and provider contracts. |
| IC-015 | Repositories/data access do not contain UI behavior, provider behavior, authorization shortcuts, or unbounded business workflows. |
| IC-016 | External calls never hold long database transactions; persist intent/state, call provider, reconcile result/event idempotently. |

## 5. Domain and data boundaries

| Rule | Constitution |
|---|---|
| IC-017 | Catalog owns current product/taxonomy/commercial publication state; it cannot mutate historical OrderItem snapshots. |
| IC-018 | Inventory owns availability, reservation, allocation, and movements; cart/UI cannot directly change stock. |
| IC-019 | Order owns order workflow/snapshots; Payment and Shipping own their separate aggregates/events and report validated transitions. |
| IC-020 | Content owns published editorial data; SEO owns canonical/indexability/redirect policy; Media owns asset lifecycle/rights metadata. |
| IC-021 | Customer/Identity owns session/customer/consent state; Authorization owns staff capabilities; Analytics only observes safe events. |
| IC-022 | Immutable evidence includes order snapshots, payment/shipment events, inventory movements, audit logs, source mappings, and consent history. |

## 6. Security and authorization boundaries

| Rule | Constitution |
|---|---|
| IC-023 | Authentication establishes identity; authorization is enforced in application services on every protected read/command. |
| IC-024 | Frontend visibility is never authorization. Customer ownership and staff capability checks are mandatory server-side. |
| IC-025 | Secrets are environment-managed, server/worker-only, never committed, logged, returned to clients, or placed in analytics. |
| IC-026 | Webhooks require provider-adapter signature/replay/schema/idempotency validation before any state transition. |
| IC-027 | Logs, errors, analytics, audit details, and media metadata must minimize PII/financial/secret exposure. |

## 7. Quality, feedback, and recovery

| Rule | Constitution |
|---|---|
| IC-028 | Use shared design tokens/component/state contracts; do not hardcode unapproved brand colors, fonts, iconography, or visual values. |
| IC-029 | Every async/sensitive task exposes truthful loading, processing, pending, success, warning, error, unavailable, expired, partial, and retry behavior where relevant. |
| IC-030 | Success requires authoritative confirmation; never show paid, shipped, delivered, refunded, published, or permission-changed success optimistically. |
| IC-031 | Error recovery preserves safe context, provides permitted next action, creates observability/audit evidence where needed, and never leaks internals. |
| IC-032 | Public routes are server-rendered/SEO-safe as required; account/cart/checkout/order/tracking/admin/query states remain private/non-indexable. |
| IC-033 | Accessibility, responsive behavior, performance, and semantic structure are implementation requirements, not optional post-build polish. |

## 8. Configuration, dependencies, and deployment

| Rule | Constitution |
|---|---|
| IC-034 | Configuration is environment-specific, validated, fail-fast for required capabilities, and never uses production secrets/data in local/preview/staging. |
| IC-035 | Every dependency needs documented justification, security/maintenance/license review, architecture-boundary review, and removal/upgrade plan. |
| IC-036 | No dependency/provider may bypass ports, domain services, authorization, validation, audit, or migration rules. |
| IC-037 | Deployment requires tested environment separation, backup/rollback, migration compatibility, monitoring, approval gates, and post-release validation. |

## 9. Migration safety

| Rule | Constitution |
|---|---|
| IC-038 | Imports are staged, validated, idempotent, quarantined on error, reconciled to source, and never mutate the source system without approval. |
| IC-039 | No legacy public URL, media relation, metadata, or content is discarded without explicit keep/redirect/merge/archive/retire decision and validation. |
| IC-040 | Customer, order, payment, shipment, consent, and staff migration occur only after client/legal/finance/security approval and source-data validation. |

## 10. Review and definition of done

| Rule | Constitution |
|---|---|
| IC-041 | Changes are small, focused, traceable to requirement/route/domain/design decisions, and reviewed for unintended boundary impact. |
| IC-042 | A change that alters public route, SEO, data, money, inventory, authorization, media rights, provider behavior, or migration requires specialized review/gates. |
| IC-043 | Tests validate behavior and failure/recovery, not merely implementation details. |
| IC-044 | Documentation, observability, audit, accessibility, SEO, migration impact, and release evidence update with the code change. |
| IC-045 | If any constitution gate is unresolved, implementation stops or explicitly limits scope; it does not create a hidden assumption. |

## 11. Phase 7 permission boundary

T007 may be sequenced as `READY` after this constitution is complete, but Phase 7 agents may implement only the approved, non-provider, non-migration, non-client-gated foundation scope established by the implementation gate matrix. Payment, shipping, customer/order migration, final brand values, source data imports, legal/policy, provider configuration, and production deployment remain blocked until their separate gates pass.

## 12. Required companion documents

Future agents must follow the detailed constitutions for repository structure, code organization, language, frontend, backend, API, domain, data access, authorization, security, payment, shipping, media, search, SEO, accessibility, performance, error recovery, observability, configuration, dependency, testing, migration, deployment, CI/CD, Git/review, feature lifecycle, definition of done, gates, risks, decisions, and traceability.
