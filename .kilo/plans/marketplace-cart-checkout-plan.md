# Marketplace Cart & Checkout — Implementation Status & Remaining Work

> Mode: planning. Source work was done across prior code turns; this document records the
> TRUE current state (incl. one in-progress edit that currently breaks typecheck) and the
> exact remaining steps. Implementation requires a running MySQL (not available in this
> environment) for end-to-end runtime; code/build verification does not.

## Decisions (locked)
Cart = server-side DB + auth | Auth = Clerk | DB = MySQL + Prisma 7 | Payment = Midtrans Snap
(sandbox) | Shipping = RajaOngkir/Binderbyte (key TBD) | Stock tracked per product |
Checkout = Address -> Payment -> Order | Admin = basic order management | Emails = Resend.

## What is DONE (source on disk)
- `prisma/schema.prisma` (User, Address, Category, Product, Cart, CartItem, Order, OrderItem,
  OrderStatusHistory, OrderStatus enum). `Product.images` is `Json` (MySQL has no scalar lists).
- `prisma.config.ts` — datasource url lives here (Prisma 7: not in schema.prisma). `.env` has
  MySQL + Clerk/Midtrans/Resend/RajaOngkir placeholders; added `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`.
- `src/lib/prisma.ts` — imports from `@/generated/prisma` (tsconfig path `@/generated/*` added).
- `src/middleware.ts` — `clerkMiddleware` (v7), public-route allowlist, `auth().protect()` for
  /checkout, /orders, /admin. Webhooks are public.
- `src/context/CartContext.tsx` (provider) + `src/components/cart/CartIcon.tsx` (badge).
- `src/app/layout.tsx` wrapped with `ClerkProvider` + `CartProvider`.
- `src/presentation/components/header.tsx` — Clerk `SignedIn/Out` + `UserButton` + `CartIcon`.
- `src/app/sign-in` + `src/app/sign-up` — Clerk `<SignIn/>`/`<SignUp/>`.
- `src/app/produk/page.tsx` — client, fetches `/api/products`.
- `src/app/produk/[slug]/page.tsx` — client, fetches `/api/products/[slug]`, "Tambah ke Keranjang".
- API routes: `cart`, `cart/items/[productId]`, `addresses`, `addresses/[id]`, `shipping/rates`,
  `orders`, `orders/[id]`, `products`, `products/[slug]`, `webhooks/clerk`, `webhooks/midtrans`.
- `prisma/seed.ts` (maps `src/data/products.ts` -> Categories+Products, stock default 50) + `npm run db:seed`.
- `src/types/midtrans-client.d.ts` — ambient module declaration (midtrans-client ships no types).
- `src/lib/order-status.ts` — pure `mapMidtransStatus()` / `classifyMidtransOutcome()`.
- Checkout pages: `checkout/address` (list/create address + shipping rates + pick courier),
  `checkout/payment` (POST /api/orders -> snap.pay), `checkout/success` (poll order, clear cart).
- Orders pages: `orders` (list), `orders/[id]` (detail + status timeline).
- Admin: pre-existing mock `lib/admin/orders.ts` + list/detail pages + `api/admin/orders/[id]/transition`.

## IN PROGRESS — currently BREAKS typecheck
- Webhook route `src/app/api/webhooks/midtrans/route.ts` was refactored to call
  `mapMidtransStatus(transaction_status, fraud_status)` and uses a `finalStatus` const inside the
  `$transaction` closure, **but the `import { mapMidtransStatus } from "@/lib/order-status"` line was
  NOT added.** This must be added or typecheck/build fail. Also confirm no stray reference to the
  old `let newStatus` remains.

## Remaining concrete steps (implementation agent)
1. **Fix the webhook import**: add
   `import { mapMidtransStatus } from "@/lib/order-status";` at top of
   `src/app/api/webhooks/midtrans/route.ts`. Re-run `npm run typecheck`.
2. **Verify quality gates**: `npm run typecheck`, `npm run lint`, `npm test` must all pass.
   (Before the webhook refactor: typecheck clean, lint clean, 56 tests passing.)
3. **Add unit tests**: `tests/unit/order-status.test.ts` covering `mapMidtransStatus` for
   capture+accept->PAID, capture+challenge->PENDING_PAYMENT, settlement->PAID, deny/cancel/expire
   ->CANCELLED, refund->REFUNDED, unknown->null. (Pure function, no DB needed.)
4. **Build**: `npm run build` should succeed — product pages are client components (no DB at build);
   `/api/products` is `force-dynamic`; admin uses mock data. Verify no prerender touches the DB.
5. **Provision MySQL** (user/infra): install/start MySQL, set `DATABASE_URL` in `.env`/`.env.local`,
   run `npx prisma generate`, `npx prisma db push` (or `prisma migrate dev`), then `npm run db:seed`.
6. **Config in dashboards** (user): Clerk publishable/secret + `CLERK_WEBHOOK_SECRET` (User sync
   webhook -> `/api/webhooks/clerk`); Midtrans server/client keys (sandbox) + payment webhook
   -> `/api/webhooks/midtrans`; RajaOngkir/Binderbyte key; Resend key; `NEXT_PUBLIC_APP_URL`.
7. **Manual sandbox E2E**: sign in -> add to cart -> /checkout/address -> pick courier ->
   /checkout/payment -> Midtrans Snap pay -> webhook flips order PAID + decrements stock + sends
   email -> /checkout/success -> /orders shows it. Negative: add>stock rejected; duplicate
   webhook idempotent; expired order stays PENDING_PAYMENT.

## Known caveats
- Admin order management uses the pre-existing MOCK order model, not the live Prisma `Order`.
  Wiring admin to real orders (status mapping + transition API on real DB) is a follow-up; the
  plan's MVP scope only required the admin UI/flow to exist and not 404/500.
- No MySQL in this sandbox, so runtime DB calls (cart, checkout, orders) cannot be verified here;
  only code, type, lint, and unit tests can be verified.

## Open questions (out of scope for MVP)
Coupon/promo codes, guest wishlist, product variants, digital products, multi-warehouse, PPN.
