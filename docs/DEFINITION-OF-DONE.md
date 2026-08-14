# PENA AMEEN Definition of Done

**Phase:** 6 — Implementation Constitution

A feature is not done because it works locally. It is done only when applicable requirements below have evidence and no blocking gate is bypassed.

## Completion requirements

| Area | Definition of done |
|---|---|
| Functional behavior | Implements approved requirement/use case and authorized state transitions; handles success, failure, empty, loading, partial, unavailable, expired, processing, and retry states as applicable |
| Type safety | Strict types, no unsafe `any`/assertion/non-null escape, explicit nullability/error/result contract |
| Domain/data | Respects ownership, snapshots, lifecycle, integrity, transaction, idempotency, audit, retention, and migration contracts |
| Tests | Appropriate unit/integration/contract/component/E2E/security/a11y/perf/migration/regression evidence passes |
| Accessibility | Semantic/keyboard/focus/screen-reader/forms/dialog/table/media/contrast/motion/responsive behavior validated |
| Security | Authz/ownership/input/secrets/PII/webhook/upload/redirect/rate-limit/audit requirements validated |
| SEO | Public route/canonical/metadata/indexability/structured data/redirect/sitemap/media/internal link impact validated |
| Responsive | Compact through wide task behavior and touch/zoom/reflow state validated |
| Error/recovery | Safe user/staff feedback, retry/manual review/idempotency/observability behavior documented/tested |
| Performance | Route/query/media/client bundle/cache/job impact measured against applicable budget/gate |
| Observability | Structured log/correlation/metric/trace/audit/alert/runbook behavior exists as applicable |
| Configuration | Required config validated, no secrets committed/exposed, environment behavior documented |
| Dependencies | Added/changed dependency has approved constitution evidence and no boundary bypass |
| Migration safety | Source/target, import/redirect/media/data/rollback/reconciliation impact validated where applicable |
| Documentation | Requirement/architecture/data/design/decision/runbook/traceability documents updated |
| Code review | Focused change reviewed; critical findings resolved; CI gates pass |
| Release | Staging/approval/rollback/monitoring/post-release evidence complete when release scope requires it |

## Non-negotiable failures

A feature is **not done** if it has unhandled provider/policy/data assumptions, missing tests for high-risk behavior, client-side authority for money/inventory/auth, silent migration/SEO impact, inaccessible critical flow, unredacted secret/PII, unexplained dependency, or unreviewed breaking change.
