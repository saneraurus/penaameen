# PENA AMEEN Dependency Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory dependency governance. No package is installed or approved by this document.

## 1. Admission requirements

Every proposed dependency must document:

1. business/technical justification and alternatives considered;
2. architectural layer and boundary impact;
3. security posture, vulnerability/secret/data implications;
4. maintenance activity, compatibility, upgrade/removal plan;
5. license/commercial compatibility where applicable;
6. bundle/runtime/performance impact;
7. test/mocking strategy;
8. provider lock-in/data migration/rollback impact;
9. owner and approval record.

## 2. Prohibited dependency behavior

- Bypassing domain services, data access, authorization, validation, audit, ports/adapters, or SEO/migration rules.
- Direct provider SDK use in UI/domain/repository.
- Adding a package for one trivial helper when platform/language capability suffices.
- Adding multiple overlapping state/form/date/http/UI libraries without architecture decision.
- Shipping unreviewed transitive code, abandoned package, incompatible license, or secret-bearing configuration.
- Changing lockfiles/packages in documentation phases or unrelated feature commits.

## 3. Review and lifecycle

- Dependency changes are isolated, justified, security-reviewed, type/build/test validated, documented, and included in release/rollback assessment.
- Remove unused dependencies and update vulnerable packages through focused reviewed changes.
- Provider adapters may use provider SDKs only after provider approval and only inside integration boundary.
- Final tooling/lint/test/build dependencies are selected during Phase 7 foundation under this constitution and approved technical decisions.
