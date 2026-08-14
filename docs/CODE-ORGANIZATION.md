# PENA AMEEN Code Organization Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory organization rules for future code. No physical module/files are created here.

## 1. Dependency direction

```text
Presentation / delivery adapters
        ↓
Application services
        ↓
Domain policies, ports, events
        ↓
Data-access and integration adapter implementations
        ↓
Infrastructure/provider libraries
```

Dependencies point inward toward stable domain/application contracts. Domain code does not depend on framework, persistence, provider SDK, browser, or UI component implementation.

## 2. Module boundaries

| Module layer | Responsibility | Allowed imports | Forbidden imports |
|---|---|---|---|
| Presentation | Route/layout/component/form rendering and intent collection | Application service contract, view-model types, design tokens/components | Repository, ORM, provider SDK, secrets, direct database access |
| Delivery adapter | HTTP/API/webhook/Server Action translation | Application services, validation/auth context, safe transport types | Domain-state mutation shortcuts, provider model leakage into core |
| Application service | Use-case orchestration/transaction/authorization/idempotency/audit/outbox | Domain, repositories/ports through interfaces | UI component, direct provider SDK model, browser globals |
| Domain | Rules, state, invariants, ports, events | Domain primitives only | Framework, database, HTTP, UI, provider SDK |
| Repository/data access | Persist/query domain data and read models | Database transaction/query infrastructure, domain persistence types | UI, provider SDK, authorization policy shortcuts |
| Integration adapter | Translate approved provider contract | Provider SDK/HTTP, port contract, safe config | UI, core domain model mutation outside service |
| Worker | Deliver job/event to application service | Service contracts, job/context adapters | Direct arbitrary database/provider mutation |
| Shared | Small cross-cutting pure primitives | Stable type/error/result utilities | Domain-specific business logic dumping ground |

## 3. Feature and domain organization

- Organize business code by domain/use case, not by UI screen or provider.
- A feature may compose multiple domains only through explicit application service/orchestration boundary.
- Public module APIs are narrow; internal files are not imported across domain boundaries.
- Avoid circular dependencies. If two domains need shared concepts, introduce a neutral domain primitive or event/port, not a bidirectional import.
- Do not create a generic `utils` dumping ground; shared utility must have one stable, cross-domain reason.

## 4. Naming and file responsibility

| Item | Rule |
|---|---|
| Domain names | Use product vocabulary: Catalog, Inventory, Cart, Order, Payment, Shipping, Content, SEO, etc. |
| Types | Nouns for entities/value objects; verbs/intent for commands; past tense for events where appropriate |
| Services | Name by use case, e.g. `CreateCheckoutOrder`, not generic manager/helper |
| Repositories | Name by owned aggregate/read responsibility, not screen |
| Ports | Name capability, e.g. `PaymentProviderPort`, `ShippingProviderPort` |
| Adapters | Name provider-neutral role plus provider implementation only inside integration boundary |
| UI | Name by semantic component/page pattern, not raw visual color/layout |
| Tests | Name expected behavior and condition, not internal method/private implementation |

## 5. Forbidden coupling

- UI directly accessing persistence, ORM, database, provider SDK, environment secrets, or raw webhook payload.
- Domain importing Next.js, React, browser APIs, database driver, or provider SDK types.
- Provider-specific statuses/models stored as core order/payment/shipment state without adapter normalization.
- Repositories deciding authorization, page navigation, notification wording, or business state transitions.
- Components implementing tax, pricing, inventory, payment, shipping, permission, redirect, or SEO business policy.
- Shared utilities importing a feature module or becoming a circular-dependency escape hatch.
- Feature branches adding undocumented top-level architecture without constitution/decision review.

## 6. Public/private API rule

Every module exposes an intentional public contract. Internal implementation details, raw persistence shapes, provider responses, secrets, and unvalidated data remain private. Changes to a public module contract require compatibility, test, documentation, and downstream review.
