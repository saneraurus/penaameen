# PENA AMEEN Repository Architecture

**Phase:** 6 — Implementation Constitution

**Status:** CONCEPTUAL structure only. No directory, source file, configuration, infrastructure file, migration tooling, or application code is created by this document.

## 1. Repository boundary

The repository will contain one modular monolith codebase with separate web and worker runtime entry boundaries, shared domain/application contracts, data access, integration adapters, tests, scripts, configuration validation, and documentation.

## 2. Intended conceptual structure

```text
repository/
├── application/                 # application composition boundary
│   ├── web-runtime/             # Next.js public/account/admin/API/webhook delivery
│   ├── worker-runtime/          # durable jobs/outbox/reconciliation/indexing delivery
│   ├── domain/                  # domain types, policies, events, ports
│   ├── application-services/    # use-case orchestration and transactions
│   ├── data-access/             # repositories/query/read models and transaction adapters
│   ├── integrations/            # payment/shipping/storage/search/notification/auth adapters
│   ├── presentation/            # route/layout/component delivery contracts
│   ├── shared/                  # narrowly scoped cross-cutting primitives only
│   └── configuration/           # typed config validation and environment boundary
├── tests/                       # unit/integration/contract/component/e2e/security/a11y/perf/migration
├── scripts/                     # reviewed operational/dev/migration validation utilities
├── documentation/               # architecture, decisions, runbooks, contracts
├── tooling/                     # lint/type/test/build conventions when approved
└── deployment/                  # conceptual manifests/runbooks only after approval
```

Names are conceptual. Final physical naming is selected during Phase 7 foundation setup under this constitution; it must preserve the runtime/domain/data/integration boundaries shown above.

## 3. Runtime responsibilities

| Boundary | May do | Must not do |
|---|---|---|
| Web runtime | Server-render public/account/admin routes, API/webhook delivery, session resolution, input translation | Directly own domain policy, provider SDK business logic, long-running job work |
| Worker runtime | Process durable jobs/outbox, retries, reconciliation, notifications, indexing, media/SEO follow-up | Render browser pages or bypass service authorization/state rules |
| Domain | Define business policies, types, state machines, ports/events | Import framework/UI/provider/database details |
| Application services | Orchestrate use cases, authorization, transactions, audit/outbox | Render UI or leak provider contracts |
| Data access | Read/write through repositories/transactions | Decide UI behavior, provider logic, broad business workflows |
| Integration | Adapt approved external provider contracts to ports | Define core Payment/Shipment/Order domain models |
| Presentation | Render UI, forms, route state, accessible feedback | Access persistence or provider SDKs directly |
| Infrastructure | Configure deployment/hosting only after approval | Become a business/domain dependency |

## 4. Test and script boundaries

- Tests mirror behavior boundaries, not arbitrary file layout.
- Test fixtures are synthetic/minimized and never include unapproved client data/secrets.
- Scripts are reviewed, documented, idempotent where relevant, environment-scoped, and cannot mutate production/source data by default.
- Migration utilities remain conceptual until Phase 9 approval; no ad hoc import scripts are allowed in feature code.

## 5. Documentation and configuration

- Documentation remains part of the repository contract; code changes update affected architecture/decision/runbook/test documents.
- Configuration is validated at application boundaries and is separate from source code; secrets are never stored in repository paths.
- No application source, `app/`, `src/`, component, API, database, Docker, CI, or deployment directory is created during Phase 6.
