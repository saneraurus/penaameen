import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@/generated/prisma";
import { getApiSettings } from "@/lib/admin/api-settings";
import {
  buildCasakuConfig,
  generateQrisForOrder,
} from "@/lib/payment/casaku-service";
import { CasakuError } from "@/lib/payment/casaku";
import { createMidtransSnapClient } from "@/lib/payment/midtrans-client";
import { getSheetCatalogProducts } from "@/lib/inventory/sheets-catalog";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    statusHistory: true;
  };
}>;

const createOrderSchema = z.object({
  addressId: z.string().optional(),
  shippingMethod: z.string().trim().min(1),
  shippingCost: z.number().int().nonnegative(),
  shippingRate: z.record(z.string(), z.unknown()).optional(),
  customerEmail: z.string().optional(),
  customerName: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        slug: z.string().optional(),
        quantity: z.number().int().positive(),
        price: z.number().int().nonnegative().optional(),
        name: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .min(1),
  shippingAddress: z.object({
    recipientName: z.string().trim().min(1),
    phone: z.string().trim().min(5),
    email: z.string().email().optional(),
    addressLine1: z.string().trim().min(1),
    addressLine2: z.string().optional().nullable(),
    city: z.string().trim().min(1),
    province: z.string().trim().min(1),
    postalCode: z.string().trim().min(3),
  }),
});

function mapCasakuFailure(error: string, detail?: string): string {
  switch (error) {
    case "not_configured":
      return "Pembayaran QRIS belum dikonfigurasi oleh admin toko.";
    case "already_exists":
      return "QRIS untuk pesanan ini sudah dibuat sebelumnya.";
    case "db_persist_failed":
    case "db_read_failed":
      return "Gagal menyimpan data pembayaran ke database. Silakan coba lagi atau hubungi admin.";
    case "casaku_api":
      return detail || "Penyedia QRIS mengembalikan error. Silakan coba lagi.";
    case "casaku_unknown":
      return "Terjadi gangguan pada layanan QRIS. Silakan coba Transfer Bank Manual.";
    default:
      return detail || "Terjadi gangguan pada layanan pembayaran QRIS.";
  }
}

// C-4 FIX: order numbers must be unique. The previous random suffix had a
// real (if small) collision window against the @unique constraint, which would
// drop the order. Use a UUID suffix so collisions are effectively impossible,
// and retry on P2002 just in case.
function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return `PA-${yyyy}${mm}${dd}-${suffix}`;
}

type CreateOrderArgs = {
  orderNumber: string;
  userId: string;
  subtotal: bigint;
  shippingCost: bigint;
  total: bigint;
  shippingAddress: unknown;
  shippingMethod: string;
  shippingRate: unknown;
  orderItemsToSave: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }>;
};

async function createOrderWithRetry(
  args: CreateOrderArgs,
  maxAttempts = 3,
): Promise<{ id: string }> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const orderNumber =
      attempt === 1 ? args.orderNumber : generateOrderNumber();
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: args.userId,
          status: "PENDING_PAYMENT",
          subtotal: args.subtotal,
          shippingCost: args.shippingCost,
          total: args.total,
          currency: "IDR",
          shippingAddress:
            args.shippingAddress as unknown as Prisma.InputJsonValue,
          shippingMethod: args.shippingMethod,
          ...(args.shippingRate != null
            ? {
                shippingRate:
                  args.shippingRate as unknown as Prisma.InputJsonValue,
              }
            : {}),
          items: {
            create: args.orderItemsToSave.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: BigInt(item.price),
              subtotal: BigInt(item.price * item.quantity),
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING_PAYMENT",
              note: "Pesanan dibuat, menunggu verifikasi pembayaran",
            },
          },
        },
      });
      return { id: order.id };
    } catch (err) {
      lastError = err;
      const isUniqueViolation =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002";
      if (!isUniqueViolation) throw err;
      // Retry with a fresh order number on collision.
    }
  }
  throw lastError;
}

// Resolves incoming cart/checkout items to real DB products. The storefront
// cart identifies products by static catalog ids/slugs, while OrderItem.productId
// is a foreign key to the DB Product table (cuid ids). Resolving by slug keeps
// the FK valid and uses the authoritative DB price.
type RawOrderItem = {
  productId: string;
  slug: string | undefined;
  quantity: number;
  price: number | undefined;
  name: string | undefined;
  image: string | undefined;
};

async function resolveOrderItems(items: RawOrderItem[]) {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, price: true, image: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const byId = new Map(products.map((p) => [p.id, p]));
  const sheetProducts = await getSheetCatalogProducts();
  const bySheetSlug = new Map(
    (sheetProducts ?? []).map((product) => [product.slug, product]),
  );

  const resolved: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }> = [];
  const missing: string[] = [];

  for (const item of items) {
    const db =
      (item.slug && bySlug.get(item.slug)) || byId.get(item.productId) || null;
    if (!db) {
      missing.push(item.slug || item.productId);
      continue;
    }
    const sheet = item.slug ? bySheetSlug.get(item.slug) : undefined;
    if (
      sheet &&
      (sheet.status !== "published" || sheet.stock < item.quantity)
    ) {
      missing.push(item.slug || item.productId);
      continue;
    }
    resolved.push({
      productId: db.id,
      quantity: item.quantity,
      price: sheet?.price ?? Number(db.price),
      name: sheet?.name ?? db.name,
      image: sheet?.image || db.image,
    });
  }

  return { resolved, missing };
}

export async function POST(request: Request) {
  try {
    let userId: string | null = null;
    try {
      const authObj = await auth();
      userId = authObj?.userId ?? null;
    } catch {
      // Unauthenticated fallback
    }

    const body = await request.json();
    const {
      addressId,
      shippingMethod,
      shippingCost,
      shippingRate,
      items: clientItems,
      shippingAddress: clientAddress,
      customerEmail,
      customerName,
    } = createOrderSchema.parse(body);

    const orderNumber = generateOrderNumber();

    // 1. Determine items. The storefront cart uses static catalog ids/slugs,
    // so we collect raw items (with slug when available) and resolve them to
    // real DB products further down — see resolveOrderItems.
    const rawItems: RawOrderItem[] = [];

    // Try read from DB cart if userId exists
    if (userId) {
      try {
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: { product: true },
            },
          },
        });

        if (cart && cart.items.length > 0) {
          for (const i of cart.items) {
            rawItems.push({
              productId: i.productId,
              slug: i.product?.slug,
              quantity: i.quantity,
              price: Number(i.product?.price ?? i.productId),
              name: i.product?.name,
              image: i.product?.image,
            });
          }
        }
      } catch {
        // ignore
      }
    }

    // Fallback to clientItems if DB cart was empty
    if (rawItems.length === 0 && clientItems && clientItems.length > 0) {
      for (const i of clientItems) {
        rawItems.push({
          productId: i.productId,
          slug: i.slug,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
          image: i.image,
        });
      }
    }

    if (rawItems.length === 0) {
      return NextResponse.json(
        {
          error:
            "Keranjang belanja kosong. Silakan pilih produk terlebih dahulu.",
        },
        { status: 400 },
      );
    }

    // Resolve raw items to real DB products (valid FK + authoritative price).
    const { resolved: orderItemsToSave, missing } =
      await resolveOrderItems(rawItems);

    if (orderItemsToSave.length === 0) {
      return NextResponse.json(
        {
          error:
            "Produk dalam pesanan tidak ditemukan di katalog toko. Silakan muat ulang halaman dan coba lagi.",
          missing,
        },
        { status: 400 },
      );
    }

    // 2. Determine Address
    let addressSnapshot:
      z.infer<typeof createOrderSchema.shape.shippingAddress> | undefined =
      clientAddress ?? undefined;

    if (addressId && userId) {
      try {
        const dbAddress = await prisma.address.findFirst({
          where: { id: addressId },
        });
        if (dbAddress) {
          addressSnapshot = {
            recipientName: dbAddress.recipientName,
            phone: dbAddress.phone,
            addressLine1: dbAddress.addressLine1,
            city: dbAddress.city,
            province: dbAddress.province,
            postalCode: dbAddress.postalCode,
          };
        }
      } catch {
        // ignore
      }
    }

    if (!addressSnapshot) {
      // H-2 FIX: never fall back to the owner's personal address. Silently
      // shipping orders to the store owner is a data/fulfilment bug. Require a
      // real shipping address instead.
      return NextResponse.json(
        {
          error:
            "Alamat pengiriman wajib diisi. Silakan lengkapi alamat sebelum memesan.",
        },
        { status: 400 },
      );
    }

    const subtotal = orderItemsToSave.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + shippingCost;

    let savedOrderId: string | null = null;

    // 3. Save into Prisma DB. Guest checkout (no Clerk session) is supported
    // by upserting a guest user, so the order record always exists before QR
    // generation. Without a persisted order, generateQrisForOrder would fail
    // on the casakuTransactionId update and surface a misleading
    // "Penyedia QRIS tidak tersedia" error.
    try {
      let dbUser = null;

      if (userId) {
        dbUser = await prisma.user.findFirst({
          where: { clerkId: userId },
        });

        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                clerkId: userId,
                email: customerEmail || `${userId}@user.penaameen.com`,
                name:
                  customerName ||
                  addressSnapshot?.recipientName ||
                  "Pelanggan Pena Ameen",
              },
            });
          } catch {
            dbUser = await prisma.user.findFirst();
          }
        }
      } else {
        const guestEmail = customerEmail || `guest-${Date.now()}@penaameen.com`;
        dbUser = await prisma.user.upsert({
          where: { email: guestEmail },
          update: {},
          create: {
            clerkId: `guest_${guestEmail}`,
            email: guestEmail,
            name:
              customerName ||
              addressSnapshot?.recipientName ||
              "Pelanggan Pena Ameen",
          },
        });
      }

      if (dbUser) {
        const created = await createOrderWithRetry({
          orderNumber,
          userId: dbUser.id,
          subtotal: BigInt(subtotal),
          shippingCost: BigInt(shippingCost),
          total: BigInt(total),
          shippingAddress: addressSnapshot,
          shippingMethod,
          shippingRate,
          orderItemsToSave,
        });
        savedOrderId = created.id;
      }
    } catch (dbErr) {
      console.warn("Could not save order to database:", dbErr);
      return NextResponse.json(
        {
          error:
            "Pesanan gagal dibuat di database. Silakan coba lagi atau hubungi admin.",
          detail: dbErr instanceof Error ? dbErr.message : String(dbErr),
        },
        { status: 500 },
      );
    }

    // 4. Generate payment: Casaku QRIS (primary), Midtrans Snap (backup)
    let casaku:
      | (Omit<import("@/lib/payment/casaku").CasakuQrisData, "qrString"> & {
          qrString?: string;
          expiresAt: string;
        })
      | null = null;
    let casakuError: string | null = null;
    let snapToken: string | undefined = undefined;
    let redirectUrl: string | undefined = undefined;

    try {
      const settings = getApiSettings();
      if (buildCasakuConfig(settings)) {
        if (!savedOrderId) {
          // Order was never persisted — cannot generate a Casaku transaction
          // reference for it. This is a database/order problem, not a QRIS
          // provider problem, so keep the message truthful.
          console.error("[CASKU] Skipping QRIS: order not persisted", {
            orderId: savedOrderId,
            amount: total,
          });
          casakuError =
            "Pesanan gagal disimpan ke database, sehingga QRIS tidak dapat dibuat. Silakan coba lagi atau hubungi admin.";
        } else {
          try {
            const result = await generateQrisForOrder(
              savedOrderId,
              total,
              settings,
            );
            if (result.ok) {
              casaku = {
                ...result.data,
                expiresAt: result.expiresAt.toISOString(),
              };
            } else {
              console.error("[CASKU] generateQrisForOrder returned failure:", {
                orderId: savedOrderId,
                amount: total,
                error: result.error,
                detail: result.detail,
              });
              casakuError = mapCasakuFailure(result.error, result.detail);
            }
          } catch (casakuErr) {
            console.error("[CASKU] generateQrisForOrder threw:", {
              orderId: savedOrderId,
              amount: total,
              error:
                casakuErr instanceof Error
                  ? {
                      name: casakuErr.name,
                      message: casakuErr.message,
                      status:
                        "status" in casakuErr
                          ? (casakuErr as { status?: unknown }).status
                          : undefined,
                      stack: casakuErr.stack,
                    }
                  : casakuErr,
            });
            casakuError =
              casakuErr instanceof CasakuError && casakuErr.status === 403
                ? "Pembayaran QRIS belum diaktifkan oleh admin toko"
                : casakuErr instanceof CasakuError
                  ? casakuErr.message
                  : "Terjadi gangguan pada layanan pembayaran QRIS. Silakan coba Transfer Bank Manual.";
          }
        }
      }
    } catch {
      // Ignore settings read error
    }

    // NOTE: no fabricated/mock QRIS fallback here. A fake QR string would
    // render a scannable image that never triggers a real payment — the
    // order would stay PENDING forever. If Casaku is unavailable, the
    // client falls back to Midtrans Snap or shows a truthful error.

    if (!snapToken) {
      try {
        const midtrans = createMidtransSnapClient();
        const parameter = {
          transaction_details: {
            order_id: orderNumber,
            gross_amount: total,
          },
          customer_details: {
            first_name: addressSnapshot.recipientName,
            phone: addressSnapshot.phone,
            shipping_address: {
              first_name: addressSnapshot.recipientName,
              address: addressSnapshot.addressLine1,
              city: addressSnapshot.city,
              postal_code: addressSnapshot.postalCode,
              phone: addressSnapshot.phone,
            },
          },
          item_details: orderItemsToSave.map((item) => ({
            id: item.productId,
            price: item.price,
            quantity: item.quantity,
            name: item.name.slice(0, 50),
          })),
        };

        const midtransResponse = await midtrans.createTransaction(parameter);
        snapToken = midtransResponse.token;
        redirectUrl = midtransResponse.redirect_url;

        // C-2: persist correlation id so the webhook can resolve this order.
        if (savedOrderId) {
          await prisma.order
            .update({
              where: { id: savedOrderId },
              data: { midtransOrderId: orderNumber },
            })
            .catch(() => {
              /* non-fatal */
            });
        }
      } catch {
        // C-3 FIX: fail closed. Do NOT fabricate a mock token.
      }
    }

    return NextResponse.json({
      orderId: savedOrderId,
      orderNumber,
      total,
      casaku,
      casakuError,
      snapToken,
      redirectUrl,
      items: orderItemsToSave,
      shippingAddress: addressSnapshot,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error creating order" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      const authObj = await auth();
      userId = authObj?.userId ?? null;
    } catch {
      // Unauthenticated
    }

    let dbOrders: OrderWithRelations[] = [];
    try {
      if (userId) {
        dbOrders = await prisma.order.findMany({
          include: {
            items: {
              include: { product: true },
            },
            statusHistory: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch {
      // db unavailable - return empty list
    }

    const formattedOrders = dbOrders.map((order) => {
      const shippingAddress = order.shippingAddress as {
        recipientName?: string;
        addressLine1?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        phone?: string;
      } | null;

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingNumber:
          ((order as Record<string, unknown>).trackingNumber as
            string | null) ?? null,
        status: order.status,
        subtotal: order.subtotal.toString(),
        shippingCost: order.shippingCost.toString(),
        total: order.total.toString(),
        shippingMethod: order.shippingMethod,
        shippingRate: order.shippingRate,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          subtotal: item.subtotal.toString(),
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            image: item.product.image,
            price: item.product.price.toString(),
          },
        })),
        shippingAddress: shippingAddress
          ? {
              recipientName: shippingAddress.recipientName || "",
              phone: shippingAddress.phone || "",
              addressLine1: shippingAddress.addressLine1 || "",
              city: shippingAddress.city || "",
              province: shippingAddress.province || "",
              postalCode: shippingAddress.postalCode || "",
            }
          : null,
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [] });
  }
}
