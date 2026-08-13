# Commerce Data Request — Payment and Shipping

Current payment and shipping details are `UNKNOWN` from public discovery. The information below is required before implementation planning.

## PAYMENT

| Requirement | What is needed | Why it matters | Current status | Preferred source |
|---|---|---|---|---|
| Provider | Payment gateway/provider name | Determines integration, fees, settlement, payment methods | UNKNOWN | Secure dashboard invitation or written confirmation |
| Account ownership | Legal account owner and finance contact | Ensures correct settlement and support ownership | UNKNOWN | Client finance confirmation |
| Payment methods | Bank transfer, QRIS, cards, e-wallets, COD, etc. | Affects checkout UX and provider configuration | UNKNOWN | Provider settings export |
| Webhook configuration | Event URLs, secret handling process, event types | Required for automatic order status updates | UNKNOWN | Provider dashboard/docs |
| Refund process | Who can refund, partial/full refunds, workflow | Needed for support and admin operations | UNKNOWN | Finance SOP/provider settings |
| Settlement behavior | Settlement timing, fees, bank account, reports | Needed for reconciliation | UNKNOWN | Provider reports/finance SOP |
| Payment status mapping | Provider statuses to order statuses | Prevents stuck/incorrect orders | UNKNOWN | Provider docs + current WooCommerce settings |
| Test/sandbox access | Non-production test credentials or sandbox account | Required for safe validation | UNKNOWN | Secure invitation |

## SHIPPING

| Requirement | What is needed | Why it matters | Current status | Preferred source |
|---|---|---|---|---|
| Provider / aggregator | Shipping integration provider name | Determines API, couriers, AWB/label support | UNKNOWN | Secure dashboard invitation/written confirmation |
| Supported couriers | Courier and service list | Controls checkout options | UNKNOWN | Provider settings export |
| Origin address | Warehouse/origin address for rates and labels | Required for rate calculation and shipment creation | UNKNOWN | Client operations confirmation |
| Package rules | Packaging types, default package, bundle rules | Affects cost accuracy and fulfillment | UNKNOWN | Operations SOP |
| Weight rules | Product weight source and fallback rules | Required for shipping rates | UNKNOWN | Product export + SOP |
| Shipping rate calculation | Live rates, table rates, free shipping, handling fees | Needed to match expected checkout behavior | UNKNOWN | Current WooCommerce/shipping settings |
| Shipment creation | Manual vs automatic shipment creation | Affects admin workflow | UNKNOWN | Operations SOP/provider settings |
| AWB generation | When/how tracking numbers are generated | Needed for customer notifications | UNKNOWN | Provider docs/settings |
| Tracking | Tracking URL/status events | Needed for order updates | UNKNOWN | Provider docs/settings |
| Shipping label generation | Printable label format and trigger | Needed for fulfillment | UNKNOWN | Provider docs/settings |
| Cancellation | Shipment cancellation rules | Needed for failed/refunded orders | UNKNOWN | Operations SOP/provider docs |
| Return handling | Return labels/process and customer support workflow | Needed for post-purchase support | UNKNOWN | Operations SOP |

## Required decisions before implementation

- CLIENT DECISION REQUIRED: keep current providers or select new providers.
- CLIENT DECISION REQUIRED: which payment methods launch in Phase 1.
- CLIENT DECISION REQUIRED: which couriers/services launch in Phase 1.
- CLIENT DECISION REQUIRED: whether shipment/AWB/label generation must be automatic at launch or can be manual initially.
