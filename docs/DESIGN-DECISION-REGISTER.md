# PENA AMEEN Design Decision Register

**Phase:** 5 — Design System & UX Blueprint

**Status:** Design decisions are explicitly classified. This register does not promote a proposal into an approved visual rule.

## Design decisions

| ID | Decision | Status | Evidence / recommendation | Client decision required | Impact |
|---|---|---|---|---|---|
| DSD-001 | PENA AMEEN is an education-oriented single-vendor commerce platform with AL-BARQY and ACM pillars | CONFIRMED | Project, product, discovery, and IA evidence | No | Content, commerce, trust hierarchy |
| DSD-002 | “Belajar Tanpa Mengenal Usia” is migration-sensitive brand wording | CONFIRMED | Brand-content audit/source title pattern | Copy/usage approval still required | Brand/content hierarchy |
| DSD-003 | Brand assets, logo rules, colors, fonts, and style guide are available | UNKNOWN | No design assets found in repository; client request remains outstanding | Yes: CDR-029 | Final visual language/tokens |
| DSD-004 | Imagery, illustration, iconography, tone, and cultural positioning are defined | UNKNOWN | Content positioning exists but no approved visual direction | Yes: CDR-029 | Media/brand expression |
| DSD-005 | Use semantic design tokens before final values | PROPOSED | Preserves brand flexibility and accessibility validation | Brand values approval required | Token/component architecture |
| DSD-006 | Use semantic typography roles rather than approve a font now | PROPOSED | Font/license/coverage/brand approval absent | Yes: CDR-029 | Content, commerce, admin readability |
| DSD-007 | Use semantic color roles without final colors | PROPOSED | Color palette unknown; state/accessibility require semantic model | Yes: CDR-029 | Status/contrast/brand implementation |
| DSD-008 | Dark mode is included in future token capability but not a launch requirement | DEFERRED | No dark-theme requirement/evidence | Optional later decision | Token/theme scope |
| DSD-009 | Shop remains visually discoverable independently from Education | CONFIRMED requirement / PROPOSED presentation | Phase 1/2 commerce/navigation requirements | Final nav label approval CDR-026 | Public hierarchy |
| DSD-010 | Education groups AL-BARQY, ACM, and articles without making them competing top-level routes | PROPOSED | Phase 2 IA model | CDR-026/027 | Navigation/content hierarchy |
| DSD-011 | AL-BARQY hub/product-category/content-category presentation uses distinct purposes | PROPOSED | Phase 2 taxonomy/IA | CDR-027 | Content-commerce UX |
| DSD-012 | ACM is displayed as hub/content/product-family, not unsupported product category | PROPOSED | Phase 2 taxonomy evidence | CDR-027 | Content-commerce UX |
| DSD-013 | Public page design follows canonical route/SEO/migration intent | CONFIRMED constraint | SEO/migration/IA control documents | Per-route decisions remain gated | Page UX/redirect safety |
| DSD-014 | Cart/checkout/order/tracking states use truthful normalized status patterns | CONFIRMED requirement / PROPOSED pattern | Commerce, order, payment, shipping architecture | Provider/state policy required | Commerce UX |
| DSD-015 | Payment and shipping UX remain provider-neutral | CONFIRMED constraint | Decision log D004/D005 and PRDs | Provider decisions required | Checkout/tracking UX |
| DSD-016 | Account is optional/conditional; guest order access requires safe policy | CLIENT DECISION REQUIRED | Account PRD/IA | CDR-008 | Account/checkout UX |
| DSD-017 | Admin UX is capability/data-ownership aware, not a confirmed role matrix | PROPOSED | Admin/authorization/data architecture | CDR-010 | Admin pattern/action visibility |
| DSD-018 | Component taxonomy has 45 semantic components | PROPOSED | Component architecture blueprint | Final implementation/design values require approval | Consistency/system scope |
| DSD-019 | Universal UI state taxonomy governs feedback across domains | PROPOSED | Commerce/technical/error architecture | Provider/state mappings required | State consistency/accessibility |
| DSD-020 | Accessibility is a required design behavior, not certification claim | CONFIRMED project principle / PROPOSED system | Project/NFR/accessibility blueprint | Formal target/testing plan later | All UX patterns |
| DSD-021 | Motion is restrained and reduced-motion compatible | PROPOSED | Accessibility/performance requirements | Brand motion direction unknown | Feedback/interaction |
| DSD-022 | Media presentation is rights-aware and uses explicit missing/processing states | CONFIRMED constraint / PROPOSED pattern | Media/migration/legal documents | Media rights/asset approval required | Product/content/gallery UX |
| DSD-023 | Public route UX covers 31 routes; account/admin cover private human-facing patterns | CONFIRMED route inventory / PROPOSED page patterns | Phase 2 route inventory | Conditional route data/policy required | Page UX coverage |
| DSD-024 | Phase 5 can complete design governance while visual implementation remains gated | PROPOSED phase conclusion | Unknown assets/policy recorded explicitly | CDR-029 and Phase 6 gates | T005/T006 readiness |

## Summary

| Status | Count |
|---|---:|
| CONFIRMED or confirmed constraint | 5 |
| PROPOSED | 11 |
| UNKNOWN | 2 |
| CLIENT DECISION REQUIRED | 1 |
| DEFERRED | 1 |
| Mixed confirmed/proposed or constraint/pattern | 4 |
| **Total decisions** | **24** |

The final brand visual system, values, assets, visual direction, and approval owner remain blocked until client evidence is supplied.
