# PENA AMEEN UX Patterns

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED reusable interaction patterns. These patterns define task flow and feedback, not final visual mockups, provider screens, or implementation behavior.

## 1. Pattern catalogue

| Pattern | User goal | Core sequence | Required states | Guardrails |
|---|---|---|---|---|
| Discovery | Find a relevant PENA AMEEN destination | Entry → orient → Shop/Education/Branch/Help path | loading; empty; not found | Preserve SEO/legacy landing intent; do not route unrelated URLs home |
| Browsing | Scan products/content/categories | Browse → compare context → select detail | loading; empty; unavailable | Categories/tags remain scoped; no invented filters/taxonomy |
| Filtering | Narrow valid product/content set | Reveal allowed filters → apply → show active state → clear/refine | loading; no result; unavailable | Filter URL/state remains non-indexable; data must be valid |
| Product evaluation | Decide whether a product fits need | Identity → media → description/package → price/availability → options → action | loading; unavailable; selection incomplete; price changed | No unsupported product claim, stock, variant, or package detail |
| Add to cart | Add an eligible selected item | Validate selection → submit intent → authoritative result → cart feedback | loading; success; error; unavailable | Never claim reservation/payment/order success |
| Cart editing | Review/change intended purchase | Item list → quantity/remove → authoritative summary → checkout path | empty; changed; unavailable; error | Preserve context and explain price/stock/shipping-estimate changes |
| Checkout | Submit valid purchase intent | Customer → address → shipping → payment → review → truthful outcome | invalid; rate unavailable; pending; retry required | Guest/account/policy/provider rules remain gated |
| Payment | Complete/understand payment state | Initiate → pending → verified result or recovery | pending; processing; success; failed; expired; cancelled | Browser return is not proof; provider UI remains abstract |
| Order confirmation | Understand created/paid/processing order state | Reference → state → next fulfillment/tracking/support step | pending; success; error; unavailable | Do not show payment/shipment success before verified data |
| Tracking | Find approved delivery status | Authorized lookup → shipment state → timeline/exception → support | unavailable; processing; exception; not found | No guessable-order disclosure or invented carrier state |
| Account | Self-serve approved private data | Sign in/entry → overview → orders/profile/addresses → logout | signed out; empty; access error | Account migration/history is conditional; ownership enforced |
| Education discovery | Learn about AL-BARQY/ACM and continue appropriately | Hub → explanation → resources/articles → relevant product/category | loading; empty; unavailable | Keep hub distinct from category/archive; no aggressive cross-sell |
| Article reading | Read, understand, continue learning | Title/context → body/media → related hub/article/product → next intent | loading; missing media; error | Preserve root article route/content/SEO; link editorially |
| Search | Find product/content/hub/category | Query → suggestion/refinement → grouped results → direct route | empty query; no result; typo/failure; loading | Query state non-indexable; no private data/search provider assumption |
| Admin operation | Complete authorized data/task action | Queue/list → record detail → validation → confirm → audit/result | loading; empty; access denied; conflict; retry | Capability/data ownership/audit rules control available action |
| Form completion | Supply valid information safely | Label/context → input → help → validation → submit → result | default; focus; invalid; saving; success; error | Client feedback never replaces server/domain validation |
| Error and recovery | Recover from a failed or unavailable task | Explain actual state → preserve safe context → retry/correct/support | error; retry required; unavailable; partial | No secret/PII leak, blame, false success, or destructive reset |

**UX patterns documented:** **17**.

## 2. Pattern composition rule

A page combines patterns without turning into a pattern catalog. For example, Product Detail uses discovery, product evaluation, add-to-cart, feedback, and contextual education; Checkout uses cart editing, form completion, checkout, payment, error/recovery, and confirmation.

## 3. State and feedback rule

Every pattern uses `docs/UI-STATE-SYSTEM.md` and must expose state through readable text, semantic structure, iconography where helpful, and token roles. Status, payment, stock, pricing, shipping, tracking, or authorization cannot be conveyed by animation/color alone.

## 4. Data and policy boundary

Patterns consume authoritative normalized data from prior architecture. They must not create visual rules that imply an approved provider, SKU, stock policy, tax/discount, guest-account policy, branch availability, return/refund policy, staff permission, or brand asset that remains unknown.
