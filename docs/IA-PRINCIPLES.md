# PENA AMEEN Information Architecture Principles

**Phase:** 2 — Information Architecture

**Status:** PROPOSED IA guardrails. These principles interpret the approved project constraints and discovery evidence; they do not select infrastructure, UI, providers, or implementation mechanisms.

## 1. Purpose

The information architecture must make PENA AMEEN's single-vendor commerce offer easy to find while preserving the educational, community, and SEO assets that make discovery possible. Where source data or a business decision is incomplete, this document uses `UNKNOWN` or `CLIENT DECISION REQUIRED` rather than manufacturing a final structure.

## 2. Principles

| ID | Principle | Application to PENA AMEEN |
|---|---|---|
| IA-P-01 | **Keep public navigation simple.** | The proposed primary navigation has four content destinations at most: Shop, Education, Branches, and Profile/About. Search, Cart, and Account/Tracking are utility actions. Blog, Events, Gallery, FAQ, policies, categories, and tags do not become top-level primary items by default. |
| IA-P-02 | **Make commerce immediately discoverable.** | Shop is the first proposed primary destination and product search/cart are persistent utilities. A visitor can reach Shop → category or search → product → cart without first traversing educational content. |
| IA-P-03 | **Use content to support discovery and trust.** | Articles, AL-BARQY, ACM, branch information, and approved community material provide helpful context and purposeful links to relevant products or categories. They do not become an aggressive cross-sell funnel. |
| IA-P-04 | **Do not let education compete with commerce.** | Education is one focused primary section, not a cluster of competing top-level labels. AL-BARQY, ACM, and Articles live below Education; Shop remains independently visible. |
| IA-P-05 | **Preserve existing SEO equity by default.** | Existing high-value product, product-category, article, homepage, branch, gallery, shop, and blog URLs are retained where possible. A changed route needs a specific documented target and redirect decision; unknown source URLs remain unknown. |
| IA-P-06 | **Make URLs predictable and stable.** | Use lowercase, hyphenated, trailing-slash canonical content paths. Preserve documented legacy patterns when they are the least risky path. Use stable entity slugs, not transient navigation labels, in public URLs. |
| IA-P-07 | **Avoid unnecessary taxonomy.** | A taxonomy term is introduced only when it has a clear shopper, editorial, operational, or SEO purpose. Existing legacy taxonomy is preserved for migration analysis, not automatically expanded into new facets or menu items. |
| IA-P-08 | **Give categories and tags different jobs.** | Categories are stable primary browse/SEO groupings. Tags are optional, sparse, cross-cutting descriptors and are not created merely to repeat category, author, product type, or program names. |
| IA-P-09 | **Do not leave indexable content orphaned.** | Every indexable product, article, category, branch, and approved event/gallery page needs a parent/discovery path plus at least one meaningful internal-link path. Search alone is not adequate orphan prevention. |
| IA-P-10 | **Minimize URL depth without erasing meaning.** | Use shallow, comprehensible paths such as `/shop/`, `/product/[slug]/`, `/education/[pillar]/`, and `/branches/[slug]/`. Do not add route layers solely to mirror an internal hierarchy. |
| IA-P-11 | **Keep mobile navigation intentional.** | Mobile is not a copy of a large desktop menu. It exposes the same essential primary destinations and utilities, with categories/content links grouped behind purposeful sections rather than an exhaustive route list. |
| IA-P-12 | **Let admin IA be deeper than public IA.** | Authorized staff need deeper task-oriented groups for catalog, orders, fulfillment, content, SEO, media, and settings. This depth is appropriate internally and must not leak into public navigation. |
| IA-P-13 | **Separate content identity from navigation placement.** | A page can remain at a migration-safe URL even if its navigation label or menu placement changes. For example, the existing `/profile/` route can be labeled About without creating a duplicate `/about/` page. |
| IA-P-14 | **Separate stateful commerce from SEO content.** | Cart, checkout, order confirmation, account, tracking results, search queries, filters, and sorting are service/state routes, not organic landing-page inventory. Their handling prevents accidental indexing and duplication. |
| IA-P-15 | **Prefer explicit transition states.** | A payment state, shipping quote, shipment, tracking event, redirected URL, empty search, or unavailable product must communicate its actual state and next path. IA cannot use an unrelated page or generic home redirect to hide a failure. |
| IA-P-16 | **Preserve the single-vendor boundary.** | No IA branch is created for sellers, seller storefronts, vendor catalog ownership, commissions, payouts, or multi-vendor fulfillment. |

## 3. Decision rules

When an IA choice is evaluated, use this order:

1. Is it supported by confirmed source evidence or an explicit project requirement?
2. Does it give a public user, customer, staff member, or crawler a clear purpose?
3. Does it protect an existing high-value URL/content relationship or provide a documented replacement?
4. Does it create a duplicate indexable route, duplicate taxonomy, unnecessary navigation label, or unowned operational workflow?
5. If evidence is incomplete, can it be marked `PROPOSED`, `UNKNOWN`, or `CLIENT DECISION REQUIRED` without blocking non-dependent planning?

A choice that fails steps 2–4 is not introduced in Phase 2.

## 4. Taxonomy invariants

- A product category is not automatically an educational program, content category, or tag.
- A content category is not automatically a product category.
- AL-BARQY and ACM can be cross-domain pillars, but each use must have a different purpose: hub, content classification, product classification, or legacy archive preservation.
- Product attributes and variants aid product selection/operations; they are not automatically public category pages.
- Tags do not replace categories and do not receive indexable archive pages by default.
- Collections are editorial merchandising arrangements, not a permanent taxonomy or a required public route.

## 5. Phase boundary

These principles are sufficient for detailed IA documentation. They do not approve a provider, choose a CMS/search/authentication mechanism, create a data model, decide final visual navigation, or authorize destructive URL migration. Client decisions and source exports listed in `docs/CLIENT-DECISION-REGISTER.md` remain binding gates.
