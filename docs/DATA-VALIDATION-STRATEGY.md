# PENA AMEEN Data Validation Strategy

**Phase:** 4 — Data Architecture

**Status:** PROPOSED validation blueprint. Validation rules describe data quality gates; they do not create scripts, schemas, imports, or production data changes.

## 1. Severity model

| Severity | Meaning | Handling |
|---|---|---|
| `BLOCKER` | Cannot safely import, publish, transact, redirect, or launch affected scope | Stop affected run/feature; assign owner; resolve or explicitly exclude with approved treatment |
| `ERROR` | Data is invalid/inconsistent and requires correction before normal use | Quarantine record/relation; report source/target context |
| `WARNING` | Data is incomplete/questionable but may be safe to retain as non-public/unpublished | Preserve provenance; require review before publication/launch |
| `INFO` | Non-blocking observation for cleanup/analytics | Record for review; no automatic change |

## 2. Validation domains

| Domain | BLOCKER checks | ERROR checks | WARNING checks | INFO checks |
|---|---|---|---|---|
| Catalog | Duplicate source/product ID or public slug; missing product name/status; unresolved required SKU/media for active product | Invalid price representation; invalid parent/variant/package mapping; missing category relation where required | Missing description, optional attribute, related product, image alt | Legacy source count/name differences |
| SKU | Duplicate normalized SKU; SKU maps to multiple sellable subjects without approved policy | Invalid format/status; retired SKU on active product | SKU missing where inventory not yet enabled | Normalization suggestion |
| Taxonomy | Duplicate scoped slug/URL; category/tag target conflict; invalid public archive redirect | Missing parent/reference, duplicate assignment | Thin/empty archive, unknown description/indexability | Source count mismatch |
| Inventory | Invalid/non-numeric quantity; inventory item without sellable mapping; allocation/reservation exceeds policy limits | Negative stock without approved backorder policy; missing location/reason | Missing threshold/backorder field | Reconciliation variance trend |
| Customer | Duplicate identity/consent ambiguity for approved migration; unsafe credential input | Invalid contact/address structure | Missing optional profile fields | Source profile count mismatch |
| Orders | Duplicate source order ID; order-item/order mismatch; totals cannot reconcile; missing currency/status mapping | Invalid quantity/unit price/snapshot relationship | Missing optional note/coupon/tracking data | Historical source timestamp variance |
| Payments | Payment/order amount-currency mismatch; duplicate provider event/ref; unverified event treated as paid | Invalid status transition/refund amount | Missing settlement metadata | Provider failure-code mapping note |
| Shipping | Shipment/order mismatch; duplicate AWB/critical provider ref; invalid tracking chronology | Missing service/cost/package data where required; invalid selected quote | Missing label/proof detail | Carrier label normalization note |
| Content | Duplicate public route; missing required article/page title/body/status; source route no mapping | Broken taxonomy/media/internal relationship | Missing excerpt/author/alt/caption | Source formatting cleanup |
| Media | Missing approved required asset; invalid MIME/file mapping; rights denied for public use | Broken usage target/duplicate source asset conflict | Missing alt/caption/dimensions/attribution | Duplicate checksum candidate |
| SEO | Duplicate canonical target; redirect loop/chain/unrelated target; priority source URL unresolved | Invalid canonical/indexability/schema relation; missing title on priority page | Missing meta/OG/image metadata; uncertain archive treatment | Non-critical metadata improvement |
| Redirects | Duplicate normalized source; self-loop; loop/chain; target unavailable | Invalid action/status/trailing slash conflict | Unverified source canonical/status | Low-priority source traffic unknown |
| Search | Private/draft item in public document; document target missing | Stale/duplicate search document | Missing synonym/description | Zero-result trend |
| Notifications | Unconsented nonessential delivery; recipient/reference mismatch | Duplicate delivery event; invalid template version | Missing preference/source evidence | Channel performance trend |
| Authorization/Audit | Privilege assignment without approved role/permission; missing sensitive audit record | Role/permission conflict; audit target missing | Incomplete reason field | Legacy staff mapping note |

## 3. Cross-domain integrity validation

- Every public Product/Article/Page/Branch/Event/Gallery route has a valid target lifecycle/SEO status and, where source exists, migration/redirect treatment.
- Every active SKU maps to one approved sellable subject and valid inventory policy.
- Every OrderItem retains valid historical snapshot data even when current Product/Variant is archived/missing.
- Every Payment/Shipment/Tracking record maps to one valid Order/attempt context without duplicate side effects.
- Every MediaUsage maps to approved MediaAsset and target; public usage has rights/publication state.
- Every Notification derives from a valid committed event and authorized recipient context.
- Every analytic/conversion event uses safe references and does not become business-state authority.

## 4. Validation execution stages

```text
Source profiling
→ file/encoding/header validation
→ identifier normalization
→ parent/reference validation
→ domain validation
→ cross-domain reconciliation
→ SEO/media/publication validation
→ dry-run report
→ approved import or quarantine
→ post-import reconciliation and audit
```

Actual tooling, error-report format, thresholds, and import execution are deferred to later phases.

## 5. Data-quality reporting

A future validation report must provide source file/run/version, record/relation identifier, severity, rule ID, safe message, target domain, suggested owner, remediation state, and correlation/audit reference. It must not expose unnecessary PII/secrets in general reports.
