# PENA AMEEN Accessibility System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED accessibility requirements. This document does not claim formal certification or a completed audit. Final conformance target, testing plan, supported assistive technology matrix, and remediation ownership require later approval.

## 1. Accessibility principle

A visitor, customer, or staff member must be able to understand and complete a core task without relying on a mouse, perfect vision, color perception, motion tolerance, high bandwidth, or insider knowledge. Accessibility applies to public, account, checkout, tracking, and admin tasks.

## 2. Semantic structure

- Use semantic landmarks for header/navigation/main/footer and logical page regions.
- Use one meaningful page heading and ordered headings for content/product/checkout/admin hierarchy.
- Use lists/tables/forms/buttons/links for their intended semantic purpose.
- Do not use visual text treatment to replace semantic relationship or state.
- Root-level article URLs retain logical Education/Blog context without fake breadcrumb URL parentage.

## 3. Keyboard and focus

| Requirement | Rule |
|---|---|
| Keyboard reachability | Every interactive control, navigation item, filter, cart/checkout/account/admin action is keyboard operable |
| Focus visibility | Use distinct visible focus token on every relevant surface/state |
| Focus order | Follow semantic task order; no visual-only side rail order mismatch |
| Focus management | Dialog/modal/menu/form error/order outcome transitions move and restore focus predictably |
| Skip mechanisms | Provide skip/navigation bypass behavior for repeated public/admin chrome as later implementation requires |
| No keyboard trap | Menus, dialogs, galleries, tables, autocomplete, and uploads offer exit/close path |

## 4. Screen-reader and feedback requirements

- Form labels, help, required/optional, error, success, pending, unavailable, and retry states are programmatically associated and announced appropriately.
- Payment, order, shipping, tracking, and admin state uses normalized text; icons/color are supplementary.
- Search result count, no-result, filter state, loading, and error changes use appropriate status announcement without excessive interruption.
- Cart quantity/remove/add feedback identifies affected item and authoritative outcome.
- Private account/order/tracking content must not be exposed through hidden labels/status output without authorization.

## 5. Contrast, color, and text

- Validate final text/background/control/status combinations against an approved contrast target after brand palette selection.
- Do not rely on color alone for required, selected, error, success, warning, stock, payment, shipping, or admin status.
- Preserve readable body, caption, label, price, metadata, table, and policy text at user zoom/reflow.
- Decorative text embedded in images cannot carry unique required content; provide equivalent text/alt/caption.

## 6. Forms, dialogs, tables, and media

| Area | Accessibility requirement |
|---|---|
| Forms | Persistent labels, field grouping/legend, required/optional text, error association, validation summary/focus, accessible disabled/loading state |
| Dialogs/modals | Accessible name/description, focus containment/return, keyboard close where safe, no hidden critical route-only information |
| Tables | Caption/context, semantic headers, row/action labeling, sortable state, responsive alternative/overflow behavior |
| Product gallery/media | Alt/caption/context, keyboard controls, selected media state, no hover-only operation |
| Images | Approved meaningful alt/caption or explicitly decorative status; rights/source metadata maintained |
| Video/audio if introduced | Requires separate approved transcript/caption/control policy; no assumption of media format |

## 7. Motion and touch

- Honor reduced-motion preference; motion is never required to understand status or complete an action.
- Avoid flashing, excessive parallax, auto-advancing content, and animated state changes that obscure focus/errors.
- Controls use final accessibility-tested touch target size tokens.
- Drag/hover/precise pointer interaction has keyboard/touch alternatives.

## 8. Responsive and error resilience

- Zoom/reflow does not hide checkout/cart/tracking/help or admin action context.
- Compact layouts preserve labels/status/actions in logical order.
- Loading/empty/error/partial/unavailable states retain clear recovery path and accessible status text.
- Network/provider errors do not reset safely entered content without explanation.

## 9. Accessibility validation gates

Before implementation/launch, validate semantic output, keyboard flows, focus management, screen-reader feedback, contrast, zoom/reflow, touch target, form/dialog/table/media patterns, reduced motion, public checkout/account/admin flows, and content/image alternatives with actual implementation and representative data. This blueprint establishes requirements, not certification.
