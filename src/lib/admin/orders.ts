import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const LIVE_ORDERS_FILE = path.join(process.cwd(), "src/data/live_orders.json");

export function loadFileOrders(): AdminOrder[] {
  try {
    if (fs.existsSync(LIVE_ORDERS_FILE)) {
      const raw = fs.readFileSync(LIVE_ORDERS_FILE, "utf-8");
      return JSON.parse(raw) as AdminOrder[];
    }
  } catch (e) {
    console.warn("Could not read live_orders.json:", e);
  }
  return [];
}

export function saveFileOrders(orders: AdminOrder[]): void {
  try {
    const dir = path.dirname(LIVE_ORDERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LIVE_ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write live_orders.json:", e);
  }
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
  paymentStatus:
    "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  fulfillmentStatus:
    "unfulfilled" | "partial" | "fulfilled" | "shipped" | "delivered";
  totalAmount: number;
  currency: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    name: string;
    name2?: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  items: AdminOrderItem[];
  paymentHistory: PaymentEvent[];
  fulfillmentHistory: FulfillmentEvent[];
  notes?: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant?: string;
}

export interface PaymentEvent {
  id: string;
  type: "payment_intent" | "charge" | "refund" | "dispute";
  status: "pending" | "succeeded" | "failed" | "cancelled";
  amount: number;
  currency: string;
  provider: string;
  providerReference?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface FulfillmentEvent {
  id: string;
  type: "packed" | "shipped" | "delivered" | "returned" | "exception";
  status: "pending" | "completed" | "failed";
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  createdAt: string;
  notes?: string;
}

export interface GetOrdersOptions {
  page: number;
  perPage: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetOrdersResult {
  orders: AdminOrder[];
  total: number;
}

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [];

export function registerLiveOrder(order: AdminOrder): void {
  const current = loadFileOrders();
  const existingIdx = current.findIndex(
    (o) => o.id === order.id || o.orderNumber === order.orderNumber
  );
  if (existingIdx >= 0) {
    current[existingIdx] = order;
  } else {
    current.unshift(order);
  }
  saveFileOrders(current);
}

export async function getOrders(
  options: GetOrdersOptions,
): Promise<GetOrdersResult> {
  const {
    page,
    perPage,
    search,
    status,
    paymentStatus,
    fulfillmentStatus,
    dateFrom,
    dateTo,
  } = options;

  let prismaOrders: AdminOrder[] = [];

  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    prismaOrders = dbOrders.map((db) => {
      const addr = db.shippingAddress as Record<string, string> | null;
      const paymentStat =
        db.status === "PAID" || db.status === "PROCESSING" || db.status === "SHIPPED" || db.status === "DELIVERED"
          ? "paid"
          : db.status === "REFUNDED"
          ? "refunded"
          : db.status === "CANCELLED"
          ? "failed"
          : "pending";

      const fulfillmentStat =
        db.status === "DELIVERED"
          ? "delivered"
          : db.status === "SHIPPED"
          ? "shipped"
          : db.status === "PROCESSING"
          ? "fulfilled"
          : "unfulfilled";

      const orderStat =
        db.status === "PENDING_PAYMENT"
          ? "pending"
          : db.status === "PAID" || db.status === "PROCESSING"
          ? "processing"
          : db.status === "DELIVERED"
          ? "completed"
          : db.status === "CANCELLED"
          ? "cancelled"
          : db.status === "REFUNDED"
          ? "refunded"
          : "pending";

      return {
        id: db.id,
        orderNumber: db.orderNumber,
        customerName: addr?.recipientName || db.user?.name || "",
        customerEmail: db.user?.email || "",
        status: orderStat,
        paymentStatus: paymentStat,
        fulfillmentStatus: fulfillmentStat,
        totalAmount: Number(db.total),
        currency: "IDR",
        itemCount: db.items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0),
        createdAt: db.createdAt.toISOString(),
        updatedAt: db.updatedAt.toISOString(),
        ...(addr
          ? {
              shippingAddress: {
                name: addr.recipientName || "",
                address1: addr.addressLine1 || "",
                ...(addr.addressLine2 ? { address2: addr.addressLine2 } : {}),
                city: addr.city || "",
                province: addr.province || "",
                postalCode: addr.postalCode || "",
                country: addr.country || "Indonesia",
                ...(addr.phone ? { phone: addr.phone } : {}),
              },
            }
          : {}),
        items: db.items.map((i: { id: string; productId: string; product?: { name?: string; slug?: string } | null; quantity: number; price: bigint | number; subtotal: bigint | number }) => ({
          id: i.id,
          productId: i.productId,
          productName: i.product?.name || `Produk ${i.productId}`,
          productSlug: i.product?.slug || `produk-${i.productId}`,
          quantity: i.quantity,
          unitPrice: Number(i.price),
          totalPrice: Number(i.subtotal),
        })),
        paymentHistory: [
          {
            id: `pay-${db.id}`,
            type: "payment_intent",
            status: paymentStat === "paid" ? "succeeded" : "pending",
            amount: Number(db.total),
            currency: "IDR",
            provider: "midtrans",
            providerReference: db.midtransOrderId || db.orderNumber,
            createdAt: db.createdAt.toISOString(),
          },
        ],
        // Derived strictly from real status history. Tracking numbers are
        // only included when real shipment/tracking data exists; none is
        // invented.
        fulfillmentHistory: db.statusHistory
          .filter(
            (h: { status: string }) =>
              h.status === "PROCESSING" ||
              h.status === "SHIPPED" ||
              h.status === "DELIVERED",
          )
          .map((h: { id: string; status: string; note?: string | null; createdAt: Date }) => ({
            id: `ful-${h.id}`,
            type:
              h.status === "SHIPPED"
                ? "shipped"
                : h.status === "DELIVERED"
                  ? "delivered"
                  : "packed",
            status: "completed",
            createdAt: h.createdAt.toISOString(),
            ...(h.note ? { notes: h.note } : {}),
          })),
      };
    });
  } catch {
    // Prisma offline/empty fallback
  }

  const fileOrders = loadFileOrders();

  // Merge live orders with file orders and prisma orders
  const allOrdersMap = new Map<string, AdminOrder>();
  for (const o of prismaOrders) allOrdersMap.set(o.id, o);
  for (const o of fileOrders) allOrdersMap.set(o.id, o);

  let filtered = Array.from(allOrdersMap.values());

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customerName.toLowerCase().includes(searchLower) ||
        o.customerEmail.toLowerCase().includes(searchLower),
    );
  }
  if (status) filtered = filtered.filter((o) => o.status === status);
  if (paymentStatus)
    filtered = filtered.filter((o) => o.paymentStatus === paymentStatus);
  if (fulfillmentStatus)
    filtered = filtered.filter(
      (o) => o.fulfillmentStatus === fulfillmentStatus,
    );
  if (dateFrom) filtered = filtered.filter((o) => o.createdAt >= dateFrom);
  if (dateTo) filtered = filtered.filter((o) => o.createdAt <= dateTo);

  filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { orders: paginated, total };
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  // 1. Try Prisma DB
  try {
    const db = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        items: { include: { product: true } },
        user: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (db) {
      const addr = db.shippingAddress as Record<string, string> | null;
      const paymentStat =
        db.status === "PAID" || db.status === "PROCESSING" || db.status === "SHIPPED" || db.status === "DELIVERED"
          ? "paid"
          : db.status === "REFUNDED"
          ? "refunded"
          : db.status === "CANCELLED"
          ? "failed"
          : "pending";

      const fulfillmentStat =
        db.status === "DELIVERED"
          ? "delivered"
          : db.status === "SHIPPED"
          ? "shipped"
          : db.status === "PROCESSING"
          ? "fulfilled"
          : "unfulfilled";

      const orderStat =
        db.status === "PENDING_PAYMENT"
          ? "pending"
          : db.status === "PAID" || db.status === "PROCESSING"
          ? "processing"
          : db.status === "DELIVERED"
          ? "completed"
          : db.status === "CANCELLED"
          ? "cancelled"
          : db.status === "REFUNDED"
          ? "refunded"
          : "pending";

      return {
        id: db.id,
        orderNumber: db.orderNumber,
        customerName: addr?.recipientName || db.user?.name || "",
        customerEmail: db.user?.email || "",
        status: orderStat,
        paymentStatus: paymentStat,
        fulfillmentStatus: fulfillmentStat,
        totalAmount: Number(db.total),
        currency: "IDR",
        itemCount: db.items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0),
        createdAt: db.createdAt.toISOString(),
        updatedAt: db.updatedAt.toISOString(),
        ...(addr
          ? {
              shippingAddress: {
                name: addr.recipientName || "",
                address1: addr.addressLine1 || "",
                ...(addr.addressLine2 ? { address2: addr.addressLine2 } : {}),
                city: addr.city || "",
                province: addr.province || "",
                postalCode: addr.postalCode || "",
                country: addr.country || "Indonesia",
                ...(addr.phone ? { phone: addr.phone } : {}),
              },
            }
          : {}),
        items: db.items.map((i: { id: string; productId: string; product?: { name?: string; slug?: string } | null; quantity: number; price: bigint | number; subtotal: bigint | number }) => ({
          id: i.id,
          productId: i.productId,
          productName: i.product?.name || `Produk ${i.productId}`,
          productSlug: i.product?.slug || `produk-${i.productId}`,
          quantity: i.quantity,
          unitPrice: Number(i.price),
          totalPrice: Number(i.subtotal),
        })),
        paymentHistory: [
          {
            id: `pay-${db.id}`,
            type: "payment_intent",
            status: paymentStat === "paid" ? "succeeded" : "pending",
            amount: Number(db.total),
            currency: "IDR",
            provider: "midtrans",
            providerReference: db.midtransOrderId || db.orderNumber,
            createdAt: db.createdAt.toISOString(),
          },
        ],
        // Derived strictly from real status history. Tracking numbers are
        // only included when real shipment/tracking data exists; none is
        // invented.
        fulfillmentHistory: db.statusHistory
          .filter(
            (h: { status: string }) =>
              h.status === "PROCESSING" ||
              h.status === "SHIPPED" ||
              h.status === "DELIVERED",
          )
          .map((h: { id: string; status: string; note?: string | null; createdAt: Date }) => ({
            id: `ful-${h.id}`,
            type:
              h.status === "SHIPPED"
                ? "shipped"
                : h.status === "DELIVERED"
                  ? "delivered"
                  : "packed",
            status: "completed",
            createdAt: h.createdAt.toISOString(),
            ...(h.note ? { notes: h.note } : {}),
          })),
      };
    }
  } catch {
    // DB query fallback
  }

  // 2. Try File Store
  const fileOrders = loadFileOrders();
  const fileMatch = fileOrders.find((o) => o.id === id || o.orderNumber === id);
  if (fileMatch) return fileMatch;

  return null;
}

export async function getOrderStatusCounts(): Promise<{
  paymentPending: number;
  fulfillmentReady: number;
  blocked: number;
  totalOrders: number;
  totalRevenue: number;
  activeProcessing: number;
}> {
  const { orders } = await getOrders({ page: 1, perPage: 1000 });

  const paymentPending = orders.filter((o) => o.paymentStatus === "pending").length;
  const fulfillmentReady = orders.filter(
    (o) =>
      (o.paymentStatus === "paid" || o.status === "processing") &&
      o.fulfillmentStatus !== "delivered" &&
      o.status !== "cancelled"
  ).length;
  const blocked = orders.filter(
    (o) => o.paymentStatus === "failed" || o.status === "cancelled"
  ).length;
  const activeProcessing = orders.filter(
    (o) => o.status === "processing" || o.paymentStatus === "paid"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid" || o.status === "completed" || o.status === "processing")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    paymentPending,
    fulfillmentReady,
    blocked,
    totalOrders: orders.length,
    totalRevenue,
    activeProcessing,
  };
}

export interface SalesDataPoint {
  date: string;
  shortDate: string;
  revenue: number;
  orders: number;
}

export interface SalesAnalytics {
  points7d: SalesDataPoint[];
  points30d: SalesDataPoint[];
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  averageOrderValue: number;
}

export async function getSalesAnalytics(): Promise<SalesAnalytics> {
  const { orders } = await getOrders({ page: 1, perPage: 10000 });
  const validOrders = orders.filter(
    (o) =>
      (o.paymentStatus === "paid" || o.status === "completed" || o.status === "processing") &&
      o.status !== "cancelled"
  );

  const now = new Date();

  function buildPoints(days: number): SalesDataPoint[] {
    const points: SalesDataPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateIso = d.toISOString().slice(0, 10);

      const matchingOrders = validOrders.filter((o) => {
        try {
          const orderDateIso = new Date(o.createdAt).toISOString().slice(0, 10);
          return orderDateIso === dateIso;
        } catch {
          return false;
        }
      });

      const dayRevenue = matchingOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const dayOrders = matchingOrders.length;

      const shortLabel =
        i === 0
          ? "Hari Ini"
          : i === 1
          ? "Kemarin"
          : d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });

      points.push({
        date: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        shortDate: shortLabel,
        revenue: dayRevenue,
        orders: dayOrders,
      });
    }

    return points;
  }

  const points7d = buildPoints(7);
  const points30d = buildPoints(30);

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const paidOrdersCount = validOrders.length;
  const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

  return {
    points7d,
    points30d,
    totalRevenue,
    totalOrders: orders.length,
    paidOrdersCount,
    averageOrderValue,
  };
}

export type OrderTransition =
  | "mark_paid"
  | "mark_processing"
  | "mark_completed"
  | "cancel"
  | "refund"
  | "mark_fulfilled"
  | "mark_shipped"
  | "mark_delivered";

const ALLOWED_TRANSITIONS: Record<
  OrderTransition,
  Partial<Record<AdminOrder["status"], AdminOrder["status"]>>
> = {
  mark_paid: { pending: "processing" },
  mark_processing: { pending: "processing" },
  mark_completed: { processing: "completed" },
  cancel: { pending: "cancelled", processing: "cancelled" },
  refund: { completed: "refunded", processing: "refunded" },
  mark_fulfilled: { processing: "processing" },
  mark_shipped: { processing: "processing" },
  mark_delivered: { processing: "completed", completed: "completed" },
};

export async function transitionOrder(
  id: string,
  transition: OrderTransition,
): Promise<AdminOrder | null> {
  const order = await getOrderById(id);
  if (!order) return null;

  const allowed = ALLOWED_TRANSITIONS[transition]?.[order.status];
  if (!allowed) return null;

  order.status = allowed;
  if (transition === "mark_paid") order.paymentStatus = "paid";
  if (transition === "refund") order.paymentStatus = "refunded";
  if (transition === "cancel") order.paymentStatus = "failed";
  if (transition === "mark_fulfilled") order.fulfillmentStatus = "fulfilled";
  if (transition === "mark_shipped") order.fulfillmentStatus = "shipped";
  if (transition === "mark_delivered") order.fulfillmentStatus = "delivered";
  order.updatedAt = new Date().toISOString();

  // Try update Prisma DB
  try {
    const prismaStatusMap: Record<string, "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"> = {
      pending: "PENDING_PAYMENT",
      processing: transition === "mark_shipped" ? "SHIPPED" : "PROCESSING",
      completed: "DELIVERED",
      cancelled: "CANCELLED",
      refunded: "REFUNDED",
    };

    const newPrismaStatus = prismaStatusMap[order.status] || "PROCESSING";

    const updateData: Record<string, unknown> = {
      status: newPrismaStatus,
    };
    if (transition === "mark_paid") updateData.paidAt = new Date();
    if (transition === "mark_shipped") updateData.shippedAt = new Date();
    if (transition === "mark_delivered") updateData.deliveredAt = new Date();
    if (transition === "cancel") updateData.cancelledAt = new Date();

    await prisma.order.update({
      where: { id: order.id },
      data: updateData as Parameters<typeof prisma.order.update>[0]["data"],
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: newPrismaStatus,
        note: `Status diperbarui oleh Admin: ${transition.replace("_", " ").toUpperCase()}`,
      },
    });
  } catch {
    // In-memory fallback
  }

  // Update in Persistent File Store
  registerLiveOrder(order);

  return order;
}
