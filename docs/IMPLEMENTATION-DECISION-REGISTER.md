# PENA AMEEN Implementation Decision Register

**Phase:** 6 — Implementation Constitution

**Status:** Implementation-level decision tracker. It does not replace client/technical/data/design registers and does not promote a proposal to confirmation.

| ID | Decision | Status | Rule / dependency | Implementation impact |
|---|---|---|---|---|
| ID-001 | Modular monolith with web and worker boundaries | PROPOSED architecture | Technical Decision TDR-001 | Future modules follow boundary; no microservice split |
| ID-002 | Next.js App Router/React/TypeScript frontend direction | PROPOSED architecture | TDR-002; Phase 7 setup approval | No framework files until Phase 7 gate |
| ID-003 | Tailwind plus owned semantic component/token direction | PROPOSED design/tech | TDR-003; CDR-029 brand values | No token/style config until brand/Phase7 approval |
| ID-004 | PostgreSQL relational target | PROPOSED architecture | TDR-005; platform/data approval | No database configuration/schema/migration yet |
| ID-005 | ORM/query library | DEFERRED | TDR-006; Phase 7/physical data decision | No ORM dependency/model choice |
| ID-006 | Server-managed sessions/capabilities | PROPOSED architecture | Auth policy/CDR-008/010 | No auth provider/config until approval |
| ID-007 | PostgreSQL-first search behind port | PROPOSED architecture | Search policy/Phase7 setup | No external engine unless decision gate passes |
| ID-008 | Database-backed outbox/jobs and worker | PROPOSED architecture | Worker/platform data/implementation decision | No queue/broker implementation yet |
| ID-009 | Payment port/provider adapter | CONFIRMED boundary / provider UNKNOWN | D004, CDR-003 | Adapter implementation BLOCKED |
| ID-010 | Shipping port/provider adapter | CONFIRMED boundary / provider UNKNOWN | D005, CDR-004 | Adapter implementation BLOCKED |
| ID-011 | Notification channel adapter | PROPOSED | CDR-017 consent/sender/provider | Channel integration BLOCKED |
| ID-012 | Object storage/media port | PROPOSED | CDR-028/media rights | Storage integration BLOCKED |
| ID-013 | SEO route/canonical/redirect governance | CONFIRMED constraint | D003, legacy mapping | Public route change requires specialized gate |
| ID-014 | Customer/guest/account model | CLIENT DECISION REQUIRED | CDR-008/009/legal | Account/customer migration implementation BLOCKED |
| ID-015 | Staff role/capability/refund authority | CLIENT DECISION REQUIRED | CDR-010 | Privileged/admin implementation BLOCKED by policy |
| ID-016 | Brand visual values/assets | CLIENT DECISION REQUIRED | CDR-029, DES-001/002 | Final visual implementation BLOCKED |
| ID-017 | Platform/hosting/CI/monitoring/DNS | CLIENT DECISION REQUIRED | CDR-028 | Deployment/config implementation BLOCKED |
| ID-018 | Tax/discount/currency/retention data rules | CLIENT DECISION REQUIRED | DATA-002/003, CDR-005/013 | Financial/customer/migration implementation BLOCKED |
| ID-019 | Source import/migration execution | BLOCKED | Exports, mapping, validation, legal/finance/provider approvals | No import/cutover code or data operation |
| ID-020 | Production deployment | BLOCKED | G8–G11, provider/platform/source approvals | No production change |

## Rule

Implementation agents must add/update an implementation decision whenever a code/tool/provider/configuration choice materially affects architecture, data, design, security, migration, or deployment. Unknown/proposed decisions remain visible and are not hardcoded as defaults.
