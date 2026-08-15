# PENA AMEEN Feature Development Lifecycle

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory feature lifecycle. No feature may bypass upstream contracts.

```text
Requirement
→ UX
→ Architecture
→ Domain
→ Data
→ Implementation
→ Tests
→ Security
→ SEO
→ Accessibility
→ Review
→ Release
```

| Stage | Required artifact/evidence | Gate |
|---|---|---|
| Requirement | Requirement ID, priority/status, customer/staff outcome, unknown/decision status | G1 |
| UX | Route/page/component/state/error/responsive/accessibility pattern | G2/G5 |
| Architecture | Domain/service/port/error/observability boundary | G3 |
| Domain | Ownership, invariant, lifecycle/event/state transition | G3/G4 |
| Data | Entity/relationship/snapshot/retention/migration/validation impact | G4 |
| Implementation plan | Scoped modules, dependencies, configuration, provider boundary, rollback impact | G6/G7 |
| Implementation | Focused code conforming to constitution | G8 |
| Tests | Unit/integration/contract/component/E2E/security/a11y/perf/migration evidence proportional to risk | G8/G9 |
| Security | Threat/ownership/input/secret/audit/provider review | G8/G9 |
| SEO | Route/canonical/metadata/redirect/sitemap/indexability/media/internal-link evidence if public | G8/G9/G10 |
| Accessibility | Semantic/keyboard/focus/form/dialog/table/media/responsive state evidence | G8/G9 |
| Review | Code/data/design/security/migration/provider documentation review | G8/G9 |
| Release | CI/CD/staging/approval/rollback/monitoring/post-release verification | G11 |

## Rules

- A missing upstream artifact blocks downstream implementation rather than being inferred by an engineer.
- A small change may have a lighter evidence set only when it cannot affect money, inventory, public route/SEO, PII, provider, migration, authorization, media rights, or shared component/data contract.
- Client/provider/legal/data gates remain binding throughout the lifecycle.
