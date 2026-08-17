# PENA AMEEN DIGITAL COMMERCE PLATFORM

## Project Type

Greenfield replatforming and rebranding of the existing PENA AMEEN website into a modern single-vendor digital commerce platform.

## Existing System

Current production website:

https://penaameen.com/

Current platform confidence:

WooCommerce / WordPress — HIGH CONFIDENCE

## Project Goals

The goals below are based only on existing discovery evidence and current project requirements. Items marked `UNKNOWN` or `CLIENT DECISION REQUIRED` in the discovery/migration documents must not be silently resolved during implementation.

- Website rebranding while preserving verified PENA AMEEN brand equity, including AL-BARQY, ACM, and existing educational positioning.
- Modern single-vendor commerce experience for PENA AMEEN products.
- Product marketplace/catalog capabilities for products, categories, tags, product images, prices, stock, variants if confirmed, and related products if confirmed.
- SEO preservation and improvement, including indexed URLs, metadata, structured data, internal links, media relationships, sitemaps, and redirects.
- Payment integration after the provider, account ownership, methods, webhooks, refunds, settlement behavior, and status mapping are confirmed.
- Automatic shipping-rate calculation after shipping provider, couriers, origin address, package rules, and weight rules are confirmed.
- Shipment creation after provider workflow and operational rules are confirmed.
- AWB/resi generation after provider support and triggering rules are confirmed.
- Printable shipping labels after provider label support and fulfillment workflow are confirmed.
- Order management for future platform operations, with historical order migration dependent on client decision.
- Inventory management based on verified product SKUs, stock quantities, stock status, and warehouse rules.
- Customer management, with customer account migration dependent on client decision and privacy/legal review.
- Content/SEO management for pages, products, articles, educational content, branches, events, galleries, and metadata.
- Administrative operations for catalog, orders, inventory, content, branches, SEO, payment, shipping, reporting, and staff permissions after requirements are approved.

## Project Phases

| Phase | Name | Status |
|---|---|---|
| PHASE 0 | Existing Website Discovery | COMPLETE |
| PHASE 0.5 | Deep Verification | COMPLETE |
| PHASE 0.75 | Migration Readiness | COMPLETE |
| PHASE 0.9 | Project Control Center | COMPLETE |
| PHASE 1 | Product Discovery & Master PRD | COMPLETE |
| PHASE 2 | Information Architecture | COMPLETE |
| PHASE 3 | Technical Architecture | COMPLETE |
| PHASE 4 | Data Architecture | COMPLETE |
| PHASE 5 | Design System | COMPLETE |
| PHASE 6 | Implementation Constitution | COMPLETE |
| PHASE 7 | Application Implementation | PARTIAL |
| PHASE 8 | QA / Acceptance | NOT STARTED |
| PHASE 9 | Migration | NOT STARTED |
| PHASE 10 | Production Launch | NOT STARTED |

## Current Source of Truth

Documentation and decisions must follow this precedence hierarchy:

1. Explicit client decisions
2. Approved Master PRD
3. Approved architecture documents
4. Approved design system
5. Migration requirements
6. Discovery findings
7. Inferences
8. Agent assumptions

Lower-level assumptions must never override higher-level decisions. If a conflict appears, stop the dependent implementation and document the conflict for review.

## Unknown Policy

Reference: `docs/UNKNOWN-REGISTRY.md`.

Rules:

- `UNKNOWN` must remain `UNKNOWN` until a required source resolves it.
- `INFERRED` must remain clearly labeled and cannot be treated as confirmed.
- `CLIENT DECISION REQUIRED` must block dependent implementation.
- Never silently invent payment providers, shipping providers, pricing, product data, customer data, legal policy, business rules, credentials, integrations, operational rules, or SEO metadata.
- Unknown values can be represented in planning documents, but implementation must not hard-code invented substitutes.

## Migration Safety

The existing website contains potentially valuable SEO equity. Future implementation must preserve or explicitly map:

- indexed URLs
- product URLs
- category URLs
- article URLs
- metadata
- structured data
- internal linking
- media relationships
- redirects

No existing URL should be removed, renamed, merged, archived, or abandoned without a documented migration decision and SEO review.

## Engineering Principles

- Architecture before implementation.
- Data before UI assumptions.
- SEO is a first-class requirement.
- Commerce correctness over visual novelty.
- Mobile-first.
- Accessibility.
- Performance.
- Security.
- Observability.
- Maintainability.
- Reusability.
- Clear separation of concerns.
- No premature abstraction.
- No unnecessary dependencies.
- Provider-agnostic payment and shipping design until providers are confirmed.
- Migration-sensitive handling of existing website data.
- Prefer reversible changes when requirements are not fully approved.

## Requirement Status System

Future requirements and tasks must use these states consistently:

| Status | Meaning |
|---|---|
| PROPOSED | Suggested but not confirmed by client or approved documents. |
| CONFIRMED | Verified by source evidence or explicit client confirmation. |
| APPROVED | Accepted as a decision for implementation by the appropriate authority/source-of-truth level. |
| BLOCKED | Cannot proceed because a dependency, unknown, or decision is unresolved. |
| PARTIAL | Work is materially implemented or documented, but defined exit criteria are not fully evidenced. |
| UNKNOWN | Not verified; must not be implemented as fact. |
| DEPRECATED | Previously valid but intentionally retired by an approved decision. |

## Control Documents

- `docs/DECISION-LOG.md` records project-level decisions and unresolved decision states.
- `docs/TASK-REGISTRY.md` records future work, phase assignment, dependencies, statuses, and blockers.
- `docs/UNKNOWN-REGISTRY.md` remains the active registry of unresolved requirements and migration-sensitive assumptions.
- Migration readiness and client-request documents define data required before implementation commitments.

## Project Status

Current Phase:
PHASE 7 — PARTIAL

Current Objective:
The authorized non-provider, non-migration, non-production foundation has been implemented: executable Next.js/TypeScript shell, semantic presentation foundation, strict configuration, domain/application/port boundaries, error/logging/audit/idempotency/authorization primitives, abstract repositories, provider-neutral contracts, tests, security baseline, and local developer tooling. Browser E2E validation is blocked by environment tooling and CI platform configuration remains client-gated.

Step 1 control-plane close (2026-08-17):
The Admin Control Center Step 1 package (`docs/ADMIN-CONTROL-CENTER-PLAN.md`) is DONE and evidenced. Committed by the owner: control-plane code in `e85992b` (audit write path + `/admin/audit`, AES-256-GCM secret hygiene with masking, invented-data removal, notification center, emergency controls, real integration health checks) and the PostgreSQL migration in `c21cf55` (schema applied to embedded Postgres in `.pgdata/`, JSON file fallbacks removed). Closed in the working tree the same day: honest checkout/payment flow (no fabricated VA/QRIS/tracking/order refs/addresses/customer data or payment-success claims; `api/orders` fails closed), repo-wide Prettier format, and full lint/type hygiene. Acceptance gates verified: `npm run check` green (prettier, eslint `--max-warnings=0`, `tsc --noEmit`, 91/91 vitest, production build). `NEXT_PUBLIC_ADMIN_WHATSAPP` is the documented source for the customer-facing admin WhatsApp number (see `.env.example`).

Next Phase:
PHASE 8 — QA / Acceptance (NOT STARTED; Phase 7 exit criteria are not fully evidenced)

Current blockers:

- Incomplete product catalog
- Incomplete URL inventory
- SEO metadata unknown
- Payment provider unknown
- Shipping provider unknown
- Client data pending
- Browser E2E runtime unavailable in the current foundation environment
- CI platform ownership/configuration remains client-gated

These blockers did not prevent Phase 1 product discovery, Phase 2 information-architecture planning, Phase 3 provider-agnostic technical architecture, Phase 4 logical data architecture, Phase 5 semantic design governance, Phase 6 implementation governance, or the authorized Phase 7 foundation. They block provider-specific, data-specific, SEO-sensitive, privacy-sensitive, brand-asset-dependent, source-migration, production implementation, and full Phase 7 exit evidence until resolved or explicitly deferred. G7, G10, and G11 restrictions remain binding.
