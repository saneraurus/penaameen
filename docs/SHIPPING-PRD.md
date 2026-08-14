# PENA AMEEN Shipping Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Provider-agnostic product requirements. No shipping provider, courier, service, API, label format, rate rule, origin, or operating SOP is selected in this document.

## 1. Shipping product outcome

The future platform must conceptually support this end-to-end shipping loop:

```text
Customer enters destination
  → system determines eligible shipping options
  → system calculates shipping cost
  → customer selects a shipping method
  → order is created
  → shipment is created
  → AWB/resi is generated or recorded
  → admin can print a shipping label when supported
  → tracking number is stored
  → customer can track the order
```

This is a required capability sequence, not a claim that every provider creates an AWB, label, or live tracking event at the same time.

## 2. Constraints and status

### CONFIRMED

- Shipping cost calculation, shipment creation, AWB/resi generation, printable-label capability, tracking-number storage, and customer tracking are in scope conceptually.
- Existing shipping provider/aggregator, supported couriers/services, origin, package/weight rules, rate rules, label workflow, cancellation, returns, and tracking behavior are UNKNOWN.
- Shipping must remain provider-agnostic until a client decision and operational evidence are available.

### Client decision gates

`REQ-SHP-008` and `CDR-004` require decisions on provider/aggregator, supported couriers/services, shipping origin(s), package/weight rules, rate/promotion rules, automated versus manual shipment creation, label workflow, cancellation, returns, and support ownership.

## 3. Shipping requirements

| Requirement ID | Requirement | Priority | Status | Dependency |
|---|---|---|---|---|
| REQ-SHP-001 | Customer can enter or select a valid shipping destination sufficient to determine eligible options. | MUST HAVE | CONFIRMED product requirement | Address fields, destination coverage, legal/privacy policy |
| REQ-SHP-002 | System can request and present eligible shipping options and costs for a valid order/destination context. | MUST HAVE | CONFIRMED product requirement | Provider, origin, product weight/dimensions, package/rate rules |
| REQ-SHP-003 | Customer can select an eligible shipping method before a shipment-required order proceeds. | MUST HAVE | CONFIRMED product requirement | Rate response and checkout state |
| REQ-SHP-004 | Authorized staff can create or initiate a shipment against a valid order using the approved operational workflow. | MUST HAVE | CONFIRMED product requirement | Provider/SOP, payment/order eligibility, package data |
| REQ-SHP-005 | Shipment tracking/AWB/resi data can be stored with the correct order/shipment context. | MUST HAVE | CONFIRMED product requirement | Provider/workflow, data validation |
| REQ-SHP-006 | Authorized staff can print or retrieve a shipping label when the selected provider/workflow supports it. | MUST HAVE | CONFIRMED product requirement | Provider label support, print workflow |
| REQ-SHP-007 | Customer can access an appropriate shipment tracking status after tracking information is available. | MUST HAVE | CONFIRMED product requirement | Tracking source, privacy/access policy |
| REQ-SHP-008 | Shipping configuration and provider operations remain abstract until PENA AMEEN approves the launch model. | CLIENT DECISION REQUIRED | BLOCKED | Provider/courier/origin/rate/package/SOP decisions |
| REQ-SHP-009 | The experience must expose rate, shipment, label, AWB, and tracking failure/retry/manual-support states. | MUST HAVE | PROPOSED safety requirement | Future error semantics/SOP |
| REQ-SHP-010 | Shipment cancellation, return, and exception handling must follow approved policy rather than assumed provider behavior. | CLIENT DECISION REQUIRED | BLOCKED | Returns/cancellation/SOP/legal policy |

## 4. Customer experience

### 4.1 Destination and rate selection

The customer journey should be:

1. add one or more eligible items to a cart;
2. provide enough destination information to obtain a rate quote;
3. see the system’s rate-calculation state;
4. review eligible shipping options, each with an approved service/method label and cost;
5. select a valid option;
6. see the selected shipping cost in the order summary;
7. continue to payment/order creation only after the shipping requirement is satisfied, unless the approved product/order policy explicitly does not require shipping.

The future interface must not claim delivery estimates, service coverage, shipping insurance, free shipping, handling fees, or courier availability that are not present in validated provider/business data.

### 4.2 Post-purchase shipping experience

After an order is validly created, the customer should see the appropriate state:

- order created / awaiting payment, if payment is not verified;
- payment verified / processing, if payment is verified but shipment is not created;
- shipment created, where this is meaningful and approved for customer display;
- tracking number/AWB/resi available, if assigned;
- shipped/in transit status, if supported by trusted operations/tracking data;
- delivered status, if supported by trusted data;
- exception/support guidance if delivery cannot be completed or status is unavailable.

A customer must not be shown a fabricated tracking status or tracking number.

### 4.3 Customer input and privacy

The exact address fields, phone requirements, recipient relationship, address persistence, guest/account lookup, and consent language are UNKNOWN. The eventual design must collect only data needed for a valid shipping transaction and support path, as approved by PENA AMEEN and applicable legal policy.

## 5. Rate calculation state model — PROPOSED

The current provider state model is UNKNOWN. The following conceptual states are intended to prevent ambiguous checkout behavior.

| State | Meaning | Customer response | Staff response |
|---|---|---|---|
| Not requested | Destination/order context is incomplete or quote has not started | Explain what information is needed; do not show a false rate | No action unless support is requested |
| Validating destination | System is checking address/coverage prerequisites | Show brief in-progress state | Review only on exception |
| Quoting | System is requesting eligible services/rates | Show loading state without allowing stale selection | Monitor error if persistent |
| Options available | One or more valid options are available | Select a method and review cost | No routine action |
| No service available | No eligible option exists for current inputs/order | Explain correction/support path; do not substitute a method | Investigate approved alternatives per SOP |
| Quote incomplete | Provider/business data is insufficient to form a valid quote | Explain retry/support path | Resolve package/origin/configuration issue |
| Quote failed | Temporary/unexpected failure occurred | Retry or contact support; no checkout with assumed cost | Review integration/operations exception |
| Quote expired/stale | A prior quote is no longer valid | Refresh/reselect before payment | Review only if repeated |
| Quote selected | Customer selected an eligible current option | Continue checkout | Revalidate when workflow requires |

No duration, retry count, fallback courier, manual rate, free-shipping threshold, or rate-expiry policy is set here.

## 6. Admin / fulfillment experience

Authorized fulfillment staff need an order-centric workspace that makes shipping work explicit and auditable.

### Required staff actions

1. locate an eligible order using order/payment/fulfillment status and search/filter context;
2. verify the shipment-ready order context according to the future operations SOP;
3. review destination, selected service, item/package information, and shipping cost context;
4. obtain or refresh shipping options when the approved workflow permits;
5. select/confirm the valid service where staff selection is required;
6. create/initiate the shipment through the abstract shipping capability;
7. obtain, record, or verify the tracking number/AWB/resi;
8. print/retrieve a label when supported;
9. update/observe shipping and tracking states;
10. handle failure, cancellation, delivery exceptions, and customer support handoff according to approved policy.

### Staff safety requirements

- Shipping action availability must follow approved order/payment/fulfillment rules; those rules are not inferred here.
- Staff must be able to distinguish a rate quote, a selected service, a shipment record, an AWB/resi, a label, and a tracking event.
- Retrying shipment creation must not knowingly create duplicate shipments; the idempotency/control design is an architecture requirement.
- Manual AWB/resi entry or manual shipment handling is **CLIENT DECISION REQUIRED**; it may be necessary as an operational fallback but cannot be assumed.
- Any label/print output must correspond to the right shipment and display only appropriate shipping information.

## 7. Shipment state model — PROPOSED

This is a conceptual business model, not a provider status mapping.

| State | Meaning | Allowed next-state examples | Notes |
|---|---|---|---|
| Not required | Order does not require shipment under approved rules | Complete / closed | Whether this applies to any product is UNKNOWN. |
| Awaiting eligibility | Order cannot yet be shipped (for example, payment/stock/order review pending) | Ready for fulfillment / cancelled | Exact gate is a client/SOP decision. |
| Ready for fulfillment | Order is operationally ready to prepare | Quote / shipment creation / hold | Customer-visible label is optional. |
| Quote selected | Valid shipping option is selected | Shipment creation / re-quote / hold | Quote may expire. |
| Shipment creation requested | Shipment action has started but is not confirmed | Created / failed / needs review | Do not show as shipped. |
| Shipment created | Shipment identity exists | AWB/label available / handoff / cancelled | Tracking number timing varies by provider. |
| AWB/resi assigned | Tracking number is recorded/verified | Label available / dispatched / exception | AWB alone does not prove dispatch. |
| Label available | Provider/workflow returned a printable label | Printed / dispatched / cancelled | Label support is provider dependent. |
| Dispatched / shipped | Shipment has been handed to carrier or equivalent approved event occurred | In transit / exception / delivered | Trigger definition must be approved. |
| In transit | Tracking indicates carrier movement | Delivered / exception / status unavailable | Customer visibility depends on trusted source. |
| Delivered | Trusted source indicates delivery | Closed / support follow-up | Proof-of-delivery data policy UNKNOWN. |
| Exception | Shipment needs operational/customer-support attention | Reattempt / return / cancellation / resolved | Exact causes/actions are policy dependent. |
| Cancelled | Shipment is validly cancelled | Re-quote / replacement / closed | Provider/financial impact unknown. |
| Return in progress | Approved return flow is active | Returned / resolved | Only if return policy is approved. |

## 8. Tracking state model — PROPOSED

Tracking is customer-facing interpretation of available shipment information. It should remain conservative.

| Tracking state | Customer-facing meaning | Data confidence rule |
|---|---|---|
| Not available yet | A tracking number/status is not available; explain next expectation/support route | Never fabricate an expected date. |
| Tracking number available | A tracking number/AWB/resi exists | Display only verified/stored value. |
| Carrier status received | Current carrier status/event is available | Preserve provider source/time where appropriate; mapping later. |
| In transit | Shipment is moving according to trusted tracking source | Do not infer delivery. |
| Delivered | Delivery indicated by trusted source | Exact proof policy is unknown. |
| Delayed/exception | Carrier/operations indicates an issue | Explain support route, not unsupported resolution promises. |
| Tracking temporarily unavailable | Current status cannot be retrieved | Allow retry/official tracking/support path. |
| Tracking not found | Tracking identifier is invalid, too new, unavailable, or unauthorized | Do not disclose other order information; support safe investigation. |

## 9. Failure and exception requirements

| Failure / exception | Required behavior | Unresolved policy/data |
|---|---|---|
| Invalid/incomplete destination | Clearly identify missing/correctable information | Exact validation source/fields |
| Unsupported destination | Do not show a false rate; offer approved support path | Coverage/manual handling |
| Missing weight/dimensions/package data | Do not silently calculate an unreliable rate | Product/package defaults and staff override policy |
| Rate-provider failure | Preserve cart/order context where safe; show retry/support path | Retry/fallback/manual-rate policy |
| No eligible courier/service | Explain no option; do not force an unavailable method | Alternate fulfillment/escalation policy |
| Rate changes/expires | Require refresh/reselection and clear order-summary review | Quote lock/expiry rules |
| Shipment creation failure | Do not mark order shipped or generate false AWB; let authorized staff retry/review | Retry/idempotency/manual fallback |
| Duplicate shipment risk | Prevent/review before repeat action | Idempotency and cancellation rules |
| AWB/resi unavailable | Keep shipment state accurate and communicate staff action; customer sees no invented tracking | Provider timing/manual entry policy |
| Label unavailable/print failure | Allow authorized retry/retrieval/support path; do not imply label printed | Provider/print workflow |
| Tracking unavailable or stale | Show conservative status and safe retry/support route | Tracking polling/webhook/manual update policy |
| Shipment cancellation/return | Follow approved policy and reconcile order/payment/customer communication | Return/cancellation/refund SOP |

## 10. Provider-agnostic boundary

The later implementation must be able to represent the business capabilities above without embedding a provider as the product model. This Phase 1 document intentionally does **not** choose:

- a shipping provider or aggregator;
- courier names, service tiers, delivery times, service areas, or fees;
- one or multiple origin addresses;
- live versus table rates, free shipping, handling fees, or insurance;
- package dimension/weight fallback rules;
- automatic versus manual shipment/AWB/label trigger;
- tracking webhook, polling, or manual update mechanism;
- cancellation, return, replacement, pickup, or proof-of-delivery policy.

## 11. Readiness dependencies

Shipping cannot be finalized for architecture/implementation without the client decisions and source data listed in `docs/COMMERCE-DATA-REQUEST.md`, especially provider, account ownership, couriers, origin, package/weight rules, rates, shipment/AWB/label workflow, tracking, cancellation, and returns. Product data (`SKU`, stock, weight, dimensions, package contents) and operational SOPs are also prerequisite inputs.
