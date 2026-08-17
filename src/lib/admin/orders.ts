import { prisma } from "@/lib/prisma";
import type { Order, OrderStatus } from "@/generated/prisma";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "partially_refunded";
  fulfillmentStatus:
    | "unfulfilled"
    | "partial"
    | "fulfilled"
    | "shipped"
    | "delivered";
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
  search?: string | undefined;
  status?: string | undefined;
  paymentStatus?: string | undefined;
  fulfillmentStatus?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
}

export interface GetOrdersResult {
  orders: AdminOrder[];
  total: number;
}

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [];

type OrderWithRelations = Order & {
  items: Array<{
    id: string;
    productId: string;
    product: { name: string | null; slug: string | null } | null;
    quantity: number;
    price: bigint;
    subtotal: bigint;
  }>;
  user: { name: string | null; email: string | null } | null;
  statusHistory: Array<{ status: OrderStatus; note: string | null }>;
};

function mapDbOrder(db: OrderWithRelations): AdminOrder {
  const addr = (db.shippingAddress ?? null) as Record<string, string> | null;

  const paymentStat: AdminOrder["paymentStatus"] =
    db.status === "PAID" ||
    db.status === "PROCESSING" ||
    db.status === "SHIPPED" ||
    db.status === "DELIVERED"
      ? "paid"
      : db.status === "REFUNDED"
        ? "refunded"
        : db.status === "CANCELLED"
          ? "failed"
          : "pending";

  const fulfillmentStat: AdminOrder["fulfillmentStatus"] =
    db.status === "DELIVERED"
      ? "delivered"
      : db.status === "SHIPPED"
        ? "shipped"
        : db.status === "PROCESSING"
          ? "fulfilled"
          : "unfulfilled";

  const orderStat: AdminOrder["status"] =
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
    customerName: addr?.recipientName || db.user?.name || "Pelanggan Pena Ameen",
    customerEmail: db.user?.email || "pelanggan@penaameen.com",
    status: orderStat,
    paymentStatus: paymentStat,
    fulfillmentStatus: fulfillmentStat,
    totalAmount: Number(db.total),
    currency: "IDR",
    itemCount: db.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),
    shippingAddress: {
      name: addr?.recipientName || db.user?.name || "Pelanggan Pena Ameen",
      address1: addr?.addressLine1 || "Alamat Pengiriman",
      city: addr?.city || "Surabaya",
      province: addr?.province || "Jawa Timur",
      postalCode: addr?.postalCode || "60238",
      country: "Indonesia",
      phone: addr?.phone || "08123456789",
    },
    items: db.items.map((i) => ({
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
    fulfillmentHistory: [
      {
        id: `ful-${db.id}`,
        type: "shipped",
        status: fulfillmentStat === "unfulfilled" ? "pending" : "completed",
        carrier: db.shippingMethod || "JNE",
        trackingNumber: `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        createdAt: db.createdAt.toISOString(),
      },
    ],
  };
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

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      {
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (fulfillmentStatus) where.fulfillmentStatus = fulfillmentStatus;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders: rows.map((r) => mapDbOrder(r as OrderWithRelations)), total };
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  const db = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: {
      items: { include: { product: true } },
      user: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });
  return db ? mapDbOrder(db as OrderWithRelations) : null;
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
      o.status !== "cancelled",
  ).length;
  const blocked = orders.filter(
    (o) => o.paymentStatus === "failed" || o.status === "cancelled",
  ).length;
  const activeProcessing = orders.filter(
    (o) => o.status === "processing" || o.paymentStatus === "paid",
  ).length;
  const totalRevenue = orders
    .filter(
      (o) =>
        o.paymentStatus === "paid" ||
        o.status === "completed" ||
        o.status === "processing",
    )
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
      (o.paymentStatus === "paid" ||
        o.status === "completed" ||
        o.status === "processing") &&
      o.status !== "cancelled",
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
  const averageOrderValue =
    paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

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

  const prismaStatusMap: Record<string, OrderStatus> = {
    pending: "PENDING_PAYMENT",
    processing: transition === "mark_shipped" ? "SHIPPED" : "PROCESSING",
    completed: "DELIVERED",
    cancelled: "CANCELLED",
    refunded: "REFUNDED",
  };

  const newPrismaStatus = prismaStatusMap[allowed] || "PROCESSING";

  const updateData: Record<string, unknown> = { status: newPrismaStatus };
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

  return getOrderById(order.id);
}
