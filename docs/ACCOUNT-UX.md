# PENA AMEEN Account UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** Conditional account and post-purchase UX. Guest checkout, account creation, customer migration, order history, order lookup, identity verification, retention, and authentication mechanisms remain policy-gated.

## 1. Account experience model

```text
Logged-out visitor
├── approved account entry / sign in
├── optional registration if enabled
├── password recovery if applicable
└── guest tracking/order lookup path

Authenticated customer
├── account overview
├── order history/detail
├── tracking
├── profile
├── addresses
└── logout
```

Account is not assumed to be a required checkout prerequisite.

## 2. Entry, sign-in, registration, and logout

| Experience | UX requirement | Status/dependency |
|---|---|---|
| Account entry | Explain account purpose and provide approved sign-in/guest path | Account policy conditional |
| Sign in | Persistent labels, safe error/recovery, route back to intended authorized task | Authentication mechanism/policy unknown |
| Registration | Explain optional/required status before data entry; request only approved fields | CLIENT DECISION REQUIRED |
| Password recovery | Generic safe recovery response without account enumeration where policy requires | SHOULD HAVE if applicable |
| Logout | Clear result and private-state transition; preserve only approved public/cart context | Session policy unknown |
| Access/session error | Explain sign-in/recovery/support path without private data leak | Security/auth architecture |

## 3. Account overview and profile

| Area | User intent | Required content | States |
|---|---|---|---|
| Overview | Find next private task | Approved shortcuts to orders, tracking, profile, addresses | loading; empty; access error |
| Profile | Manage approved contact/profile information | Field labels, privacy/help context, validation/result | default; invalid; saving; success; error |
| Addresses | Manage approved saved address data | Address cards, select/edit/add context, validation | empty; selected; invalid; saving; error |
| Preferences | View approved notification/consent choices if enabled | Plain-language current preference/policy link | unavailable until consent policy approved |

Profile/address edits never rewrite immutable OrderAddress snapshots.

## 4. Order history, detail, and tracking

| Experience | UX requirement | Privacy/authority guardrail |
|---|---|---|
| Order history | List only authorized eligible orders with date/reference/status/next action | Historical migration may be absent; show honest scope/empty state |
| Order detail | Show customer-safe line snapshot, payment/order/shipment/tracking context and help path | Do not expose provider secrets, other orders, or unsupported financial detail |
| Account tracking | Link to authorized shipment context | Tracking number alone does not imply delivery |
| Guest order lookup | Ask only approved verification information; route to safe result/support | Guessable order ID alone is insufficient; policy/security TBD |
| Tracking result | Show verified normalized state/timeline/support | No raw provider/internal data or false delivery claim |

## 5. Account errors and states

| State | UX treatment |
|---|---|
| Signed out | Explain sign-in/guest option without blocking permitted commerce |
| No account required | Route to tracking/support, not empty account shell |
| Invalid sign-in | Safe retry/recovery, no unnecessary reason disclosure |
| Password recovery requested | Generic confirmation/next step; no account enumeration |
| Session expired | Preserve safe non-sensitive context; request sign-in again |
| No orders/history | Honest empty state; explain approved scope if history migration excluded |
| Unauthorized order | Do not disclose existence; provide safe recovery/support |
| Profile/address validation error | Field-specific accessible correction, preserve safe inputs |
| Tracking unavailable | Conservative status/retry/support path |

## 6. Responsive and accessibility rules

- Account navigation condenses before private task content; current location remains clear.
- Order status, tracking action, and support path remain visible on compact screens.
- Sign-in/recovery/forms use labels, errors, focus order, and status announcement.
- Private data is not placed in visual-only hover/tooltip states.
- Logout/session transitions are announced and do not leave protected data visible in the interface.

## 7. Non-decisions

No final account provider, password/MFA/SSO flow, social login, registration fields, guest lookup factors, saved address policy, customer migration, history scope, retention, loyalty, wishlist, referral, subscription, or preference center is assumed.
