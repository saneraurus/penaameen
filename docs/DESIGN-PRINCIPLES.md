# PENA AMEEN Design Principles

**Phase:** 5 — Design System & UX Blueprint

**Status:** Design-governance principles. They define how the experience should behave and communicate, not a final visual identity, UI implementation, component library, or production interface.

## 1. Design objective

The PENA AMEEN experience must help a visitor understand the education context, discover a relevant product, transact with confidence, and follow an order through delivery without obscuring migration-sensitive content or inventing unsupported claims.

## 2. Principles

| ID | Principle | Design consequence |
|---|---|---|
| DP-01 | **Clarity before decoration** | Every page prioritizes the user’s next meaningful task, readable hierarchy, truthful state, and accessible feedback over ornamental density. |
| DP-02 | **Commerce is visible, not pushy** | Shop, product, cart, checkout, payment, tracking, and support pathways are easy to find; educational content is not reduced to a sales funnel. |
| DP-03 | **Education builds informed trust** | AL-BARQY, ACM, articles, and approved method context explain before they sell. Product links are relevant and restrained. |
| DP-04 | **Trust is earned through accuracy** | Price, availability, payment, shipment, tracking, policy, testimonial, branch, and method claims display only approved/verified data. |
| DP-05 | **State is part of the interface** | Pending, failed, expired, unavailable, empty, partial, processing, retry, and success states are explicit and never hidden behind optimistic visuals. |
| DP-06 | **Mobile is a primary commerce context** | Navigation, product discovery, cart, checkout, forms, tables, and support paths remain understandable on small touch screens. |
| DP-07 | **Accessibility is a product behavior** | Semantic structure, readable type, contrast, keyboard/focus, screen-reader feedback, touch targets, and reduced motion are built into every pattern. |
| DP-08 | **Consistency reduces operational risk** | Shared tokens, component states, status language, forms, data tables, and feedback patterns prevent conflicting customer/staff experiences. |
| DP-09 | **SEO and migration are experience constraints** | Existing public destinations, route intent, content hierarchy, canonical links, and redirects influence page hierarchy and content presentation. |
| DP-10 | **Progressive disclosure protects focus** | Do not show every policy, filter, technical detail, or admin action at once. Reveal detail when it helps a decision. |
| DP-11 | **Human-readable operations** | Admin workflows make order, payment, inventory, shipping, SEO, and exception state understandable without pretending staff permissions/policies are final. |
| DP-12 | **Design for reversible uncertainty** | Unknown brand assets, providers, policy rules, taxonomy, and data use semantic placeholders and component contracts rather than fake final visuals. |

## 3. Hierarchy model

```text
Primary task / page purpose
→ essential decision information
→ primary action
→ supporting explanation, trust, and recovery
→ secondary navigation or related discovery
```

The primary task differs by route:

- Shop/category: browse or refine discovery.
- Product: understand and add an eligible item.
- Cart: review/edit intended purchase.
- Checkout: supply/confirm valid information and payment intent.
- Order/tracking: understand truthful current status and next action.
- Article/education: learn and continue appropriately.
- Admin: complete an authorized operational task safely.

## 4. Brand and visual uncertainty rule

The following are **not known** from project evidence: logo assets and usage, approved colors, fonts, photography/illustration direction, iconography, visual tone, and cultural positioning. Design documents use semantic roles and conditional guidance only. Final visual decisions require `CDR-029` and `DES-001`/`DES-002` resolution.

## 5. Responsive-first rule

A desktop layout is not the source of truth. Every component/pattern begins with:

- essential content order;
- clear tap/keyboard interaction;
- readable measure and hierarchy;
- no lost commerce/help state;
- safe progressive enhancement for larger screens.

## 6. Design quality gate

A design pattern is acceptable only when it has a user purpose, route/IA relationship, required state coverage, accessibility behavior, data dependency boundary, responsive behavior, and migration/SEO implication where it is public.
