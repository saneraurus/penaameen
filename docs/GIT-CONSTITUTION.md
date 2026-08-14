# PENA AMEEN Git and Code Review Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory collaboration governance.

## 1. Branch and commit rules

- Work only on the approved project branch/session branch.
- Use focused commits with clear conventional intent, e.g. `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- One commit/PR change set has one coherent purpose; do not hide unrelated formatting, dependency, schema, route, provider, or documentation changes.
- Commit messages explain change intent, not implementation trivia.
- Never commit secrets, client exports, PII, payment data, credentials, production config, generated database, or unapproved media.

## 2. Change classification

| Change class | Required review/evidence |
|---|---|
| Public route/SEO/redirect | IA/SEO mapping, metadata/indexability, migration/404/redirect review |
| Data/schema/migration | Data architecture, migration contract, backup/rollback/reconciliation, security/finance review |
| Payment/shipping/provider | Port/adapter, sandbox, webhook/idempotency/retry/reconciliation, provider/client approval |
| Authorization/security | Threat/ownership/capability/audit/security test review |
| Inventory/order/refund | State/transaction/idempotency/concurrency/audit/regression review |
| Media/upload | Rights/access/validation/security/performance review |
| Design/component | Token/accessibility/responsive/state/design decision review |
| Dependency | Dependency constitution evidence and security/license/architecture review |
| Documentation | Upstream contract/traceability/control update review |

## 3. Code review rules

- Review behavior, boundary direction, data ownership, security, failure recovery, testing, accessibility, SEO, performance, observability, migration impact, and documentation—not just syntax.
- Reviewers reject hidden assumptions, unsafe assertions, provider coupling, client-side authority, direct persistence/UI coupling, and unapproved scope.
- Breaking changes require compatibility/migration/release/rollback plan.
- Review comments identify risk and required evidence; unresolved critical comments block merge.

## 4. Documentation rule

Every implementation change updates relevant decision, architecture, data, design, test, runbook, route/migration, and requirement traceability documentation when its contract changes.
