# PENA AMEEN Technical Stack Evaluation

**Phase:** 3 — Technical Architecture

**Status:** Architecture recommendations only. No framework, package, provider, infrastructure, credential, or dependency is installed or selected for production by this document.

## 1. Evaluation criteria

The recommended stack must support the Phase 1 MVP loop, the Phase 2 route inventory, server-rendered SEO, a relational commerce domain, single-vendor operations, migration safety, provider abstraction, accessibility, and a small-team maintainability profile. It must not introduce microservices, Kubernetes, a separate search cluster, or provider coupling without evidence.

## 2. Recommendation summary

| Area | Recommendation | Status | Why |
|---|---|---|---|
| Web framework | Next.js App Router on a supported Node.js runtime | PROPOSED | Supports SSR/SSG/ISR-capable public rendering, route hierarchy, server-side data access, API/webhook boundaries, and a single application surface. |
| UI runtime | React with TypeScript | PROPOSED | Fits the Next.js model and enables typed component/service contracts without creating a separate frontend application. |
| Styling | Tailwind CSS with PENA AMEEN-owned component primitives | PROPOSED | Enables a consistent responsive/accessibility-aware design system later without a heavyweight visual library assumption. |
| Architecture style | Modular monolith with a separate worker process from the same codebase | PROPOSED | Matches current scale and keeps domain transactions coherent while isolating slow/retryable work. |
| Backend boundary | Next.js server runtime, route handlers, application services, repositories, and adapter ports | PROPOSED | Separates delivery mechanisms from business rules and provider integrations. |
| Database | PostgreSQL relational database | PROPOSED | Commerce, inventory, order, audit, content, redirect, and transaction relationships need ACID transactions and relational integrity. |
| Data-access library/ORM | Decide in Phase 4/6 after data architecture and team constraints are approved | DEFERRED | Avoids forcing Prisma, Drizzle, or another abstraction before the target schema/data migration contract exists. |
| Authentication | Server-managed, session-based customer/staff sessions with role/capability authorization | PROPOSED | Meets account/admin requirements without exposing long-lived bearer credentials in the browser. Provider/library remains undecided. |
| Object storage | S3-compatible object-storage abstraction plus delivery/CDN layer | PROPOSED | Fits product, article, branch, gallery, and document media while preserving provider portability. |
| Search | PostgreSQL full-text and trigram-style search at MVP scale; external search behind a port only when measured needs justify it | PROPOSED | Catalog/content volume is unknown and no external search requirement is evidenced. |
| Background work | Durable database-backed outbox/job records processed by a separately deployable worker | PROPOSED | Supports webhooks, notifications, indexing, media processing, retries, and reconciliation without introducing a message broker prematurely. |
| Payment | Provider-port plus adapter architecture | CONFIRMED boundary / provider UNKNOWN | Payment provider, methods, refunds, settlement, and webhooks are not confirmed. |
| Shipping | Provider-port plus adapter architecture | CONFIRMED boundary / provider UNKNOWN | Shipping provider, couriers, origin, rates, labels, AWB, and returns are not confirmed. |
| Notifications | Notification service with channel adapters; transactional email is the baseline candidate | PROPOSED / channel decision required | Email, WhatsApp, SMS, in-app ownership and consent require client decisions. |
| Analytics | First-party domain-event capture plus optional external analytics adapter | PROPOSED / provider unknown | Enables privacy-conscious measurement and keeps authoritative commerce state internal. |
| Hosting | Managed Node.js/container-compatible application platform with separate web and worker processes | PROPOSED / provider decision required | Supports SSR, webhooks, jobs, staging, and deployment separation without Kubernetes. |
| CI/CD | Repository-native automated validation and gated deployment pipeline | PROPOSED | Ensures tests, route/SEO checks, migration gates, and manual production approval before release. CI provider remains a delivery decision. |

## 3. Alternatives and trade-offs

| Decision area | Alternative | Trade-off | Recommendation rationale |
|---|---|---|---|
| Next.js modular monolith | Separate React SPA plus standalone API | Adds cross-origin auth, duplicated deployment/contract complexity, and weakens SSR-first SEO ergonomics | One application boundary is simpler for current product needs. |
| Next.js modular monolith | Microservices | Splits transactions, observability, deployment, and operational ownership before scale justifies it | No documented scale/team/provider reason currently warrants microservices. |
| Managed container-compatible deployment | Fully serverless-only runtime | May complicate durable workers, long-running exports, provider reconciliation, and consistent runtime assumptions | Evaluate later; a web/worker model must be supported regardless of host. |
| PostgreSQL | Document database | Weakens relational constraints, inventory/order transactions, reporting joins, and audit consistency | Commerce requires relational integrity. |
| PostgreSQL search | External search engine at MVP | Adds sync/index operations, vendor cost, operational failure modes, and data-consistency risk | Start with measured built-in capability; retain a search port for future change. |
| Database-backed jobs/outbox | Dedicated broker/event platform | Adds infrastructure and delivery semantics before workload validates it | Durable job records plus a worker are sufficient and auditable for MVP. |
| Session-based auth | Browser-held long-lived tokens | Raises leakage/revocation/storage risk for customer/staff commerce access | Secure server-managed sessions better fit browser-first account/admin use. |
| Object storage abstraction | Database BLOB media storage | Raises database size, backup, and delivery costs | Media belongs in object storage with metadata/references in the relational database. |
| Tailwind plus owned primitives | Large visual component suite | Can impose visual/API assumptions before Phase 5 design system | The design system must own accessibility and brand decisions later. |

## 4. Explicit non-decisions

The following remain `UNKNOWN`, `CLIENT DECISION REQUIRED`, or `DEFERRED`:

- payment provider(s), payment methods, provider account ownership, settlement, refunds, and webhook mappings;
- shipping provider(s), couriers, origin, package/rate rules, AWB/label/tracking/returns behavior;
- authentication provider/library, identity verification, customer account migration, and final password/recovery policy;
- database ORM/query library;
- object-storage/CDN/search/analytics/email/monitoring/hosting/CI provider;
- hosting region, DNS, domain, budget, service-level targets, and production environment ownership;
- exact performance/load forecasts, data-retention periods, and legal/regulatory obligations.

## 5. Technology selection gate

A proposed technology can move toward implementation only when it has:

1. an approved technical decision record;
2. a confirmed owner/account/budget where it is an external service;
3. documented security, privacy, availability, backup, and operational requirements;
4. compatibility with the data architecture and migration plan; and
5. a test/staging strategy.

Until then, the stack recommendation is a deliberate blueprint, not an installed dependency list.
