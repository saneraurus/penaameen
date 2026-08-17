# PENA AMEEN Typography System

**Phase:** 5 — Design System & UX Blueprint

**Status:** Semantic typography governance. No font family, font file, scale value, line-height value, or license is approved. Final typography requires `CDR-029` brand approval and accessibility/performance validation.

## 1. Typography goals

Typography must make education content readable, commerce decisions scannable, prices unmistakable, forms actionable, and admin data dense without becoming difficult to read. It must support Indonesian/Latin content and any future approved language strategy without assuming a specific font.

## 2. Font roles

| Role | Purpose | Usage rules | Status |
|---|---|---|---|
| Display | High-level Home/education/brand emphasis | Use sparingly; never replace clear heading hierarchy; avoid long dense copy | PROPOSED role |
| Heading | Page, section, product/article/admin hierarchy | Semantic heading order follows content structure, not visual size alone | PROPOSED role |
| Body | Primary reading, product descriptions, policies, form explanation | Optimize measure, line height, contrast, language coverage | PROPOSED role |
| Caption | Supporting media/date/source/status context | Never hide required information solely in small text | PROPOSED role |
| Label | Form/table/control identification | Remains readable and associated with control/data | PROPOSED role |
| Button/action | Clear action language | Keep action readable; do not rely on capitalization/style for meaning | PROPOSED role |
| Price | Product price, sale price, order totals | Differentiate current/previous/discount context semantically and accessibly | PROPOSED role |
| Product metadata | SKU, availability, category, package context | Secondary to product title/price/action; never obscure critical availability | PROPOSED role |
| Article | Long-form title, metadata, body, quote, caption, related links | Prioritize reading rhythm and content hierarchy | PROPOSED role |
| Admin | Dense tabular/task/field/audit information | Support scanning while preserving accessible labels/values | PROPOSED role |
| Code/reference | Order IDs, SKU, tracking/admin references where approved | Use readable distinction; do not expose private identifiers publicly | PROPOSED role |

## 3. Hierarchy rules

```text
One page title
→ section headings in logical order
→ readable body and supporting metadata
→ clear actionable labels
→ captions/notes only where supplemental
```

- Do not skip semantic heading levels solely for visual effect.
- Product title, current price, availability, selection, and add-to-cart action must be distinguishable.
- Article title/body/author/date/category relationships should remain readable without visually overwhelming educational content.
- Admin table labels/status/action affordances require a clear scan order and accessible value association.

## 4. Readability rules

| Area | Requirement |
|---|---|
| Body text | Use a readable content measure and line-height; exact values are deferred |
| Article body | Favor sustained reading rhythm, paragraph spacing, clear list/quote/image caption treatment |
| Product description | Separate summary, included-package detail, relevant metadata, and longer explanation |
| Price | Use semantic labels for regular/sale/discount context; do not communicate price change by style alone |
| Forms | Labels stay visible, associated, and readable; help/error text remains legible |
| Tables | Header/value distinction, numeric alignment, responsive fallback, and accessible captions required |
| Legal/policy | Avoid compressed or decorative text; preserve readable hierarchy and version/effective context when supplied |
| Error/status | Use plain language plus status role/icon; do not use all-caps/colour alone |

## 5. Responsive scaling

Typography uses role-based responsive scaling rather than device-specific hardcoded type values:

- compact screens protect readable body/price/form labels first;
- headings may scale within a constrained hierarchy but must not create wrapping/scroll traps;
- article/body measure remains readable, not full viewport width on large screens;
- admin density can adjust through layout/overflow pattern before shrinking text below readability;
- zoom/reflow must preserve content/action access without clipping or horizontal loss for ordinary text flows.

Exact token values and breakpoint mappings remain `PROPOSED` in `docs/DESIGN-TOKENS.md`.

## 6. Letter spacing and line height

- Use letter spacing only for intentional label/code/display roles, not as a substitute for hierarchy.
- Body and article line height prioritize readability; exact ratios await font selection and test.
- Button/label letter spacing must not make Indonesian text difficult to scan.
- Price and numeric references require tabular/alignable treatment only after final font capability is verified.

## 7. Font selection gate

A final font selection must verify:

- approved brand relationship and license;
- Indonesian/Latin character coverage and punctuation/number behavior;
- readable weight/style availability;
- performance/loading/fallback behavior;
- accessible rendering at body, caption, price, form, table, and admin density roles;
- compatibility with content/media/SEO rendering and server delivery.

Until then, typography is a semantic system, not a font prescription.
