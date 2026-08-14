# PENA AMEEN Authorization Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory authorization governance. Final roles, permission assignments, approval thresholds, identity provider, MFA/SSO, customer migration, and guest lookup policy remain client-gated.

## 1. Boundary rules

- Authentication establishes session/identity context; authorization determines allowed resource/action.
- Every protected read/command is authorized in the application service, not only hidden in UI/route middleware.
- Customer access uses ownership/approved lookup policy; staff access uses approved capability bundles.
- Webhook/service actors authenticate through adapter verification, never customer/staff sessions.
- Denial behavior is safe and does not disclose protected resource existence unnecessarily.

## 2. Actor rules

| Actor | Allowed baseline | Must not assume |
|---|---|---|
| Public visitor | Published public content/catalog/search entry | Account/order/admin/private data |
| Guest customer | Approved cart/checkout/tracking lookup scope | Permanent account, order enumeration, broad history |
| Authenticated customer | Own approved profile/address/order/tracking data | Other customer data or staff authority |
| Staff | Assigned capability-scoped operations | All-admin access or finance/refund authority by default |
| Administrator | Approved configuration/access oversight | Unrestricted PII/payment/secret access by default |
| Super admin | No default role; emergency capability only if approved | Automatic existence or bypass rights |
| Worker/system | Job/provider scope only | Human/admin/customer authority |

## 3. Resource ownership

- Cart: current guest/customer session scope.
- Customer profile/address/consent: customer ownership or authorized support purpose.
- Order/payment/shipment/tracking: customer ownership/approved guest lookup or staff capability.
- Catalog/content/SEO/media: publication/edit capability plus lifecycle/rights/route rules.
- Inventory: authorized inventory/operations capability and audit.
- Roles/permissions/settings/audit: restricted access administration/security capability.

## 4. Privileged action rules

Price, inventory, publication/archive, redirect/indexability, shipment/AWB/label, payment/refund, customer PII access, role/permission, and manual recovery actions require service-level capability, state validation, reason/evidence when appropriate, audit, and idempotency/confirmation as defined by upstream policy.

## 5. Session and denial rules

- Use server-managed session architecture once implemented; browser visibility does not grant access.
- Private responses are no-store/non-indexable and minimize data exposure.
- Expired/invalid session leads to safe sign-in/recovery/support path without leaking protected data.
- Track authorization-sensitive events safely; never log session secrets, passwords, raw credentials, or unnecessary PII.

## 6. Required approvals

No code may hardcode staff roles, permission matrix, refund authority, manual shipping authority, account requirement, guest lookup factors, customer migration, or super-admin behavior until CDR-008, CDR-010, legal/security, and operations decisions are resolved.
