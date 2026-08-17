# PENA AMEEN Implementation Gate Matrix

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory sequencing gates. A later gate cannot be treated as passed because implementation appears convenient.

| Gate | Name | Prerequisites | Evidence | Owner | Status | Prohibited before passing |
|---|---|---|---|---|---|---|
| G0 | Project control | PROJECT/AGENTS/control registers read; branch/scope correct | Control review record | Implementation agent/lead | READY | Any change that contradicts control documents |
| G1 | Requirement | Requirement ID/status/priority/user outcome and unknowns known | Requirement trace/link | Product/engineering | READY for documented requirements | Feature invention or hidden scope |
| G2 | IA | Route/page/navigation/SEO/migration destination defined | IA/route/legacy mapping reference | Product/SEO/design | READY for mapped routes | New route/taxonomy/public URL change |
| G3 | Architecture | System/domain/service/port/security/error boundary defined | Technical architecture/decision record | Architecture owner | READY as blueprint | Boundary/provider/microservice invention |
| G4 | Data | Entity/relationship/ownership/lifecycle/integrity/migration impact defined | Data blueprint and validation/migration contract | Data/architecture owner | READY as blueprint | Physical schema/migration/import without approved data inputs |
| G5 | Design | UX/state/component/accessibility/responsive/media pattern defined | Design blueprint/component/page UX | Design owner | PARTIAL; brand values blocked | Final visual brand implementation without CDR-029 |
| G6 | Implementation constitution | Coding/test/security/deployment/review rules approved | Phase 6 constitution and gate evidence | Engineering governance | COMPLETE after Phase 6 acceptance | Ad hoc implementation rule/provider/dependency bypass |
| G7 | Client/provider approval | Relevant brand, legal, data, payment, shipping, account, staff, platform decisions resolved | CDR/provider/policy/source evidence | Client owner | BLOCKED for many scopes | Provider integration, source migration, final brand/policy behavior |
| G8 | Implementation | Scoped code plan and G0–G7 applicable evidence pass | Code/test/config/dependency review | Engineering | NOT STARTED | Code for blocked scope; production change |
| G9 | QA | Functional/security/a11y/performance/SEO/provider/migration tests pass | QA evidence and defects disposition | QA/engineering | NOT STARTED | Release with unaccepted critical failure |
| G10 | Migration | Source export/validation/reconciliation/redirect/media/rollback approved | Migration runbook/dry-run/sign-off | Migration/SEO/data owner | BLOCKED | Live import/cutover/source mutation |
| G11 | Launch | Release, backup, DNS, provider, monitoring, support, approval gates pass | Launch checklist and approval | Client/operations | BLOCKED | Production launch |

## Gate rule

A gate status may be `READY` for planning while dependent implementation remains `BLOCKED` by G7/G10. Passing G6 does not authorize provider integration, source migration, production deployment, or implementation without applicable client decisions.
