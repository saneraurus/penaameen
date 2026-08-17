# Phase 8 — Client Decision Checklist (CDR Gate)

**Phase:** 8 — Implementation Readiness
**Status:** READY BUT WAITING FOR DECISIONS (Entry Decision B)
**Source of truth:** `docs/CLIENT-DECISION-REGISTER.md`, `docs/UNKNOWN-REGISTRY.md`
**Companion report:** `docs/PHASE-8-READINESS.md` (this checklist is the fill-in form for the 13 CDRs that block Phase 8)

## How to respond

Every decision below must be answered with one of:

- **APPROVE** — confirm the proposed option / supply the item.
- **CHOOSE** — pick from the listed options (name it).
- **DEFER / EXCLUDE** — explicitly delay or drop the capability, with a short note.

> Silence is not an approval. A recorded `DEFER/EXCLUDE` is valid and reduces the open-decision count, but it does not permit unreviewed removal of migration-sensitive URLs/content or fabricated provider/support claims.

Return this form with each row completed. Resolutions are recorded back into `CLIENT-DECISION-REGISTER.md` and unlock the dependent gates (G7/G10/G11).

## Priority order

Resolve **CDR-002 (catalog source)** and **CDR-028 (platform)** first — they unblock the widest surface.

| # | CDR | Decision needed | Blocks | Response | Notes |
|---|-----|-----------------|--------|----------|-------|
| 1 | CDR-028 | Platform ownership: hosting, PostgreSQL, object storage/CDN, DNS, backups, monitoring, CI/CD, non-prod env | Infrastructure, CI, deploy, DB, storage, launch (G11) | ☑ CHOOSE (Option A — cheapest tier; specific provider accounts/owners finalized at provisioning) | Name owners + region/cost/security/backup constraints, or authorize engineering selection process |
| 2 | CDR-002 | Launch catalog source of truth: active/discontinued, SKUs, price/sale, descriptions, media, inventory, variants/bundles, weight/dims, warehouse | Catalog, cart, inventory, shipping, migration | ☑ CHOOSE (placeholder: image/price/product ID/product page; no fabricated data; real export still required) | Supply WooCommerce export + rules, or scope to confirmed simple products |
| 3 | CDR-003 | Payment provider(s), account owner, methods, webhooks, settlement, refunds | Payment, checkout, orders, notifications | ☑ CHOOSE (Midtrans selected — all-in-one processor) | Confirm provider/methods + SOP, or documented deferred-launch plan |
| 4 | CDR-004 | Shipping provider/aggregator, couriers, origin, rates, packages, AWB/labels, tracking | Shipping, checkout, fulfillment | ☑ CHOOSE (RajaOngkir aggregator selected — API key to be provided) | Confirm operational model + source data, or narrow/defer |
| 5 | CDR-005 | Legal/commerce policy: privacy, terms, shipping, returns, tax/price, consent | Checkout, legal pages, accounts, notifications, analytics | ☑ CHOOSE (placeholder approach: UI structure ready with clearly labeled placeholders; no fabricated legal/tax/consent content; real documents pending approval) | Provide approved policies + local-market obligations |
| 6 | CDR-006 | URL/SEO inventory + redirect governance (keep/map/merge/archive/retire per URL) | IA, routing, SEO migration, launch (G10) | ☐ APPROVE ☐ CHOOSE ☐ DEFER | BELUM SIAP — domain hint given (penaameen.com) but full URL list + keep/map/merge/archive/retire decisions per URL still required |
| 7 | CDR-007 | Content/media migration source + treatment (keep/rewrite/merge/redirect/archive) | CMS, media, SEO | ☐ APPROVE ☐ CHOOSE ☐ DEFER | BELUM SIAP — awaiting content/media export + keep/rewrite/merge/redirect/archive decisions per item |
| 8 | CDR-008 | Guest checkout / account / lookup / customer migration / consent | Checkout, accounts, tracking | ☑ CHOOSE (option 2: mandatory account, login-only order lookup, account migration decision pending) | Approve guest/account/lookup + migration model |
| 9 | CDR-009 | Historical orders migration/availability | Orders, customer history | ☐ APPROVE ☐ CHOOSE ☐ DEFER | BELUM SIAP — awaiting historical order database export + migration decision (migrate/archive-for-staff/defer/exclude) |
| 10 | CDR-010 | Staff roles, separation, SOP, refund authority, audit, escalation | Admin, permissions, payment, fulfillment | ☑ CHOOSE (RBAC - admin panel only; roles and SOP to be defined later) | Provide SOP/role map + fallback/escalation |
| 11 | CDR-017 | Notification channels, sender, consent/opt-out, fallback, matrix | Notifications, account, support | ☑ CHOOSE (Brevo selected - email channel; API key provided but not stored) | Approve baseline channel + matrix; defer optional |
| 12 | CDR-018 | Analytics / Search Console / consent governance | Analytics, migration monitoring | ☑ CHOOSE (Google Analytics 4 + Search Console selected) | Grant access + approve governance; defer optional |
| 13 | CDR-029 | Brand package: logo, palette, typography, imagery, tone, owner | Final UI, design tokens | ☑ CHOOSE (option 2: neutral design temporary; brand assets to be provided later) | Supply brand package + owner, or interim neutral-design policy |

## What stays blocked until responses land

- **0 of 16 Phase 8 workstreams can start** until the above are resolved.
- G7 (provider/brand/data/legal approval) remains BLOCKED → no provider, auth, brand, or migration work is authorized.
- G10 (migration) and G11 (launch) remain BLOCKED.

## Response template

Paste per decision and return:

```
CDR-XXX: APPROVE | CHOOSE <option> | DEFER/EXCLUDE <note>
Owner: <name/role>
Evidence supplied: <link/file>
Notes: <free text>
```

(End of file)
