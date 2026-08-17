# PENA AMEEN Coding Standards

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory TypeScript and language rules for future code. No code is created by this document.

## 1. TypeScript strictness

- Enable and preserve strict TypeScript behavior in future project configuration.
- Model domain state with explicit types, discriminated unions, branded/validated identifiers where useful, and exhaustive handling.
- Prefer compiler-enforced invariants over runtime convention alone.
- Treat nullability as part of the contract; no implicit absence assumptions.

## 2. Naming and types

| Area | Standard |
|---|---|
| Types/interfaces | Use domain nouns and capability names; choose `type` or `interface` consistently by project convention after Phase 7 setup |
| Commands | Imperative/use-case names, e.g. `CreateShipmentIntent` |
| Events | Past-tense facts, e.g. `PaymentVerified` |
| Results/errors | Discriminated union or typed error family with stable code/category |
| Boolean names | Use affirmative readable predicates, e.g. `isPublished`, `canFulfill` |
| Optional values | Represent optionality explicitly; do not encode absence with ambiguous empty string/sentinel |
| Dates/money | Use explicit domain value contracts; never rely on locale-rendered UI strings as domain values |
| Provider data | Keep in adapter/evidence types; normalize before domain/service use |

## 3. Unsafe escape hatches

| Construct | Rule |
|---|---|
| `any` | Prohibited except a documented, narrowly isolated compatibility boundary with validation plan and review approval |
| `unknown` | Preferred for untrusted input; must be narrowed/validated before use |
| `as` assertions | Allowed only after runtime/structural proof; never to silence domain, auth, provider, or nullability error |
| Non-null assertion `!` | Prohibited in domain/application/security/payment/shipping/migration paths; exception requires documented invariant and review |
| Type suppression directives | Prohibited unless temporary, linked to tracked issue/expiry, and approved in review |
| Magic values | Prohibited for states, roles, provider codes, limits, URLs, token values, or policy; use named configuration/domain constants |

## 4. Functions and async patterns

- Functions have one clear responsibility and explicit input/output/error contract.
- Application-service functions expose use-case intent, not transport/persistence detail.
- Async work handles cancellation/timeout/error category intentionally; never swallow promise rejection.
- Avoid unbounded parallel work, fire-and-forget side effects, and implicit retries.
- Side effects are explicit, idempotent where required, and observable.
- Return typed success/failure/pending/review outcomes rather than generic booleans for critical workflows.

## 5. Immutability and state

- Treat domain inputs/snapshots/events/audit records as immutable.
- Do not mutate shared objects across layer boundaries.
- Historical OrderItem, payment/shipment event, inventory movement, audit, consent, and source-mapping data is append-only or versioned.
- UI state cannot become authoritative domain state.

## 6. Errors and comments

- Use stable error codes/categories with safe user-facing translation at delivery layer.
- Do not throw raw provider/database/error payloads across layers.
- Comments explain non-obvious business/security/migration rationale, not restate syntax.
- TODO/FIXME requires owner/context/tracking reference and must not hide missing policy/provider/data decision.
- Remove dead code, commented-out code, unused exports, stale flags, and obsolete compatibility paths before merge unless explicitly retained for migration/rollback with documentation.

## 7. Module exports and review

- Prefer explicit named exports and narrow public module surfaces.
- Avoid default exports where they obscure contract naming; final lint convention can refine this without violating domain clarity.
- No code may bypass architecture through dynamic imports, reflection, global mutable state, or direct environment access without documented boundary.
- Formatting/lint/type-check rules will be selected in Phase 7 setup, but code must satisfy this constitution regardless of tool choice.
