# PENA AMEEN Admin and Audit Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical model for staff capability, sensitive operations, and auditability. Final staff roles, permissions, approval thresholds, refund authority, support visibility, and audit retention are `CLIENT DECISION REQUIRED`.

## 1. Core authorization entities

| Entity | Purpose | Required logical fields | Relationships | Lifecycle / audit |
|---|---|---|---|---|
| StaffUser | Staff identity projection for authorized operations | Identity reference, status, approved display/contact context | N:M Role via StaffUserRole; 0:N AuditLog | Active/suspended/deactivated; access/status changes audited |
| Role | Proposed capability bundle | Name, purpose, status | N:M StaffUser; N:M Permission | Draft/active/deprecated; semantic changes audited |
| Permission | Atomic action/resource capability | Resource, action, risk class, status | N:M Role via RolePermission | Active/deprecated; grant semantics versioned/audited |
| StaffUserRole | Staff-to-role assignment | StaffUser, Role, grant status/time/source | N:1 StaffUser; N:1 Role | Grant/revoke/expiry history audited; no silent deletion |
| RolePermission | Role-to-permission assignment | Role, Permission, grant status/time/source | N:1 Role; N:1 Permission | Grant/revoke history audited |
| AuditLog | Append-only sensitive action/system record | Actor, action, target, timestamp, result, correlation | Typed target to any protected entity; optional source Job/Event | Append-only; access/retention restricted |

## 2. Capability data boundary

Data supports proposed capability bundles such as catalog, inventory, order, fulfillment/shipping, payment/finance, content, SEO, media, customer support, analytics, and access administration. A capability bundle is not a confirmed staff job title and does not by itself authorize an action until PENA AMEEN approves role assignments and policy.

## 3. Audit event minimum contract

Every sensitive operation should conceptually record:

```text
WHO      actor class and safe actor reference
WHAT     action/resource/capability context
WHEN     timestamp and correlation/release context
TARGET   entity type/reference and safe before/after version summary
RESULT   success, failure, denied, pending, manual-review outcome
REASON   approved reason/source/evidence where required
```

## 4. Sensitive operation categories

| Operation | Required data/audit context | Decision dependency |
|---|---|---|
| Product/category/tag create/edit/archive | Actor, target, source/version, publish/SEO/redirect effect | Product/SEO authority |
| Price/sale/promotion change | Actor, prior/new commercial data, reason, approval context | Finance/product approval policy |
| Inventory adjustment/reservation release | Actor/system, item/location, delta, reason, related order/source | Inventory/SOP/threshold policy |
| Order state/change/note | Actor/source, prior/new state, reason, order reference | Operations/SOP/visibility policy |
| Payment review/refund | Actor, payment/refund reference, verified evidence, amount, reason | Finance/refund authority/provider policy |
| Shipment/AWB/label/tracking action | Actor/system, shipment reference, provider/manual evidence, state | Fulfillment/SOP/provider policy |
| Customer PII access/change | Actor, purpose, customer/order reference, outcome | Privacy/access policy |
| Content/media publication | Actor, target, rights/approval/publication state | Editorial/legal/rights policy |
| SEO metadata/redirect/indexability change | Actor, source/target route, reason, validation | SEO/migration authority |
| Role/permission/access change | Actor, principal, prior/new grants, reason | Access administration/approval policy |
| System job/manual recovery | Job/actor, source event, retry/result, target effect | Retry/operations policy |

## 5. Audit lifecycle and retention

AuditLog entries are conceptually immutable. Corrections append a new audit record rather than edit historical evidence. Audit access is limited by role/purpose and may itself need logging. Retention, deletion/anonymization, legal hold, export, and access-review policy remain `UNKNOWN` pending client/legal/security input.

## 6. Manual fallback record requirements

When a provider/system failure requires manual action, staff must record authorized actor, target/order/payment/shipment context, reason, source/evidence, before/after state, customer impact, and correlation to the failed automated workflow. Manual action cannot bypass idempotency, state-transition, rights, or authorization policy.
