# PENA AMEEN Implementation Risk Register

**Phase:** 6 — Implementation Constitution

**Status:** Active implementation governance risks. Risks are not permission to bypass controls.

| ID | Priority | Risk | Impact | Constitution mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| IR-001 | CRITICAL | Architecture drift/direct UI-data-provider coupling | Broken domain boundaries, untestable provider lock-in, unsafe state | Dependency direction, module/public API review, architecture gate | Engineering/architecture | OPEN |
| IR-002 | CRITICAL | Provider coupling or integration before approval | Payment/shipping/notification/security failure and rework | Ports/adapters, G7 provider gate, contract/sandbox/reconciliation requirements | Client/engineering | BLOCKED |
| IR-003 | CRITICAL | Schema/data/migration drift or unsafe import | Data loss, incorrect orders/inventory/SEO/customer exposure | Data access, migration, validation, rollback/quarantine/reconciliation constitution | Data/migration owner | BLOCKED |
| IR-004 | HIGH | SEO route/redirect/content regression | Indexing loss, 404s, lost equity | SEO constitution, route/mapping tests, specialized review/G10 gate | SEO/content/engineering | OPEN |
| IR-005 | HIGH | Authorization/ownership bug | PII, order, admin, refund, inventory exposure | Service-level authorization, audit, security tests, denial rules | Security/engineering | OPEN |
| IR-006 | HIGH | Duplicate payment/refund/webhook effect | Financial loss or false fulfillment | Idempotency, event receipt, state machine, reconciliation/manual review | Finance/engineering | BLOCKED provider data |
| IR-007 | HIGH | Inventory race/oversell | Unfulfillable orders/customer harm | Transaction/concurrency/reservation/allocation tests and audit | Operations/engineering | BLOCKED policy/data |
| IR-008 | HIGH | Shipping quote/shipment/AWB/tracking failure | Checkout/fulfillment/support failure | Shipping port, idempotency, retry/manual exception path | Operations/engineering | BLOCKED provider/SOP |
| IR-009 | HIGH | Migration corruption/media rights loss | Content/product/SEO/legal loss | Staged import, validation/quarantine, source preservation, rights gate | Migration/content/legal | BLOCKED |
| IR-010 | HIGH | Accessibility regression | Core task exclusion, legal/trust risk | A11y constitution/component/test/review gates | Design/engineering | OPEN |
| IR-011 | HIGH | Performance regression | SEO/conversion/admin usability degradation | Performance budgets/cache/media/query/bundle review | Engineering | OPEN |
| IR-012 | HIGH | Secret/PII/log leakage | Security/legal incident | Configuration/security/observability redaction rules, scans | Security/engineering | OPEN |
| IR-013 | MEDIUM | Dependency sprawl/supply-chain risk | Bundle/security/maintenance debt | Dependency admission/review/removal rules | Engineering | OPEN |
| IR-014 | MEDIUM | Insufficient observability/manual recovery | Silent provider/job/order failures | Observability/error/recovery/runbook gates | Operations/engineering | OPEN |
| IR-015 | MEDIUM | Brand/design implementation before approval | Inconsistent/unapproved public identity | Semantic tokens only, CDR-029/G5/G7 gate | Brand/design/engineering | BLOCKED |
| IR-016 | LOW | Documentation/traceability drift | Agents implement stale/inconsistent rules | Required documentation updates/audits/review | Engineering governance | OPEN |

## Summary

| Priority | Count |
|---|---:|
| Critical | 3 |
| High | 9 |
| Medium | 3 |
| Low | 1 |
| **Total risks** | **16** |
