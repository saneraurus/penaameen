# Phase 7 Dependency Decisions

**Phase:** 7 — Foundation Implementation

Dependencies are added only for the authorized foundation. No payment, shipping, analytics, cloud, ORM, database, authentication-provider, or production monitoring SDK is approved.

| Dependency | Purpose | Native alternative considered | Security / maintenance / license posture | Architecture impact |
|---|---|---|---|---|
| `next` | Approved App Router web runtime and build system | Hand-rolled SSR/framework | Mature framework; review release/security updates; license review in package metadata | Web delivery only; domain remains framework-independent |
| `react`, `react-dom` | Next.js rendering and semantic component foundation | None compatible with approved Next direction | Mature ecosystem; maintain version compatibility | Presentation only |
| `typescript` and type packages | Strict type contracts | Plain JavaScript | Compiler/toolchain dependency; no runtime business lock-in | Supports coding constitution |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss` | Tailwind-oriented semantic token/style foundation | Hand-written CSS only | Build-time style tooling; no provider lock-in | Presentation token layer only; no final brand values |
| `eslint`, `eslint-config-next` | Lint/architecture safety baseline | No linter | Build/dev tooling; keep configs minimal | Quality gate only |
| `prettier` | Deterministic formatting | Manual formatting | Dev tooling; no runtime impact | Quality gate only |
| `vitest`, `jsdom`, Testing Library packages | Unit/integration/component/accessibility-oriented test foundation | Node assert only / no DOM testing | Dev-only; deterministic test harness | Tests behavior without provider calls |
| `@playwright/test` | E2E test foundation for real browser journeys when browser runtime is available | Manual browser-only checks | Dev-only; browser install is separate and not automatically performed | Test layer only |

## Explicitly not added

- ORM/database toolkit;
- payment/shipping SDK;
- provider-specific auth, cloud storage, analytics, email, search, monitoring SDK;
- UI component library, icon library, date/money/form/state management library;
- Docker, deployment, cloud, or production infrastructure dependency.

Any future dependency must satisfy `docs/DEPENDENCY-CONSTITUTION.md` and record a focused decision.
