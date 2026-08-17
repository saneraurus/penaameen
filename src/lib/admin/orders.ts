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

const PRODUCTS_FOR_ORDERS = [
  {
    id: "1",
    name: "Paket Home Learning ALBARQY",
    slug: "paket-home-learning-albarqy",
    price: 966000,
  },
  {
    id: "2",
    name: "Paket FlashCard ALBARQY",
    slug: "paket-flashcard-albarqy",
    price: 378000,
  },
  {
    id: "5",
    name: "Paket Buku Metode Belajar Membaca ACM 3",
    slug: "paket-buku-metode-belajar-membaca-acm-3",
    price: 166000,
  },
  { id: "7", name: "Paket ALBARQY 3", slug: "paket-albarqy-3", price: 355000 },
  {
    id: "11",
    name: "Paket Home Learning Buku Belajar Cepat Membaca ACM",
    slug: "paket-home-learning-acm",
    price: 795000,
  },
  {
    id: "14",
    name: "Cinta (tak) Selamanya Indah",
    slug: "cinta-tak-selamanya-indah",
    price: 50000,
  },
  {
    id: "17",
    name: "BETON MUTU TINGGI RAMAH LINGKUNGAN",
    slug: "beton-mutu-tinggi-ramah-lingkungan",
    price: 185000,
  },
];

const CUSTOMERS = [
  { name: "Siti Aisyah", email: "siti.aisyah@example.com" },
  { name: "Budi Santoso", email: "budi.santoso@example.com" },
  { name: "Rina Marlina", email: "rina.marlina@example.com" },
  { name: "Ahmad Fauzi", email: "ahmad.fauzi@example.com" },
  { name: "Dewi Lestari", email: "dewi.lestari@example.com" },
  { name: "Eko Prasetyo", email: "eko.prasetyo@example.com" },
  { name: "Fitri Handayani", email: "fitri.handayani@example.com" },
];

const CITIES = [
  { city: "Jakarta", province: "DKI Jakarta", postalCode: "12560" },
  { city: "Bandung", province: "Jawa Barat", postalCode: "40123" },
  { city: "Surabaya", province: "Jawa Timur", postalCode: "60234" },
  { city: "Yogyakarta", province: "DI Yogyakarta", postalCode: "55281" },
  { city: "Semarang", province: "Jawa Tengah", postalCode: "50244" },
];

function buildItems(seed: number): AdminOrderItem[] {
  const count = (seed % 3) + 1;
  const items: AdminOrderItem[] = [];
  for (let i = 0; i < count; i++) {
    const product =
      PRODUCTS_FOR_ORDERS[(seed + i) % PRODUCTS_FOR_ORDERS.length]!;
    const quantity = ((seed + i) % 3) + 1;
    items.push({
      id: `${seed}-${i}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    });
  }
  return items;
}

function buildPayments(
  seed: number,
  total: number,
  paymentStatus: AdminOrder["paymentStatus"],
): PaymentEvent[] {
  const now = Date.now();
  const base = new Date(now - seed * 36 * 60 * 60 * 1000).toISOString();
  if (paymentStatus === "paid") {
    return [
      {
        id: `pay-${seed}-1`,
        type: "payment_intent",
        status: "succeeded",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-INT`,
        createdAt: base,
      },
    ];
  }
  if (paymentStatus === "pending") {
    return [
      {
        id: `pay-${seed}-1`,
        type: "payment_intent",
        status: "pending",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-INT`,
        createdAt: base,
      },
    ];
  }
  if (paymentStatus === "failed") {
    return [
      {
        id: `pay-${seed}-1`,
        type: "payment_intent",
        status: "failed",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-INT`,
        createdAt: base,
      },
    ];
  }
  if (paymentStatus === "refunded") {
    return [
      {
        id: `pay-${seed}-1`,
        type: "charge",
        status: "succeeded",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-CHG`,
        createdAt: base,
      },
      {
        id: `pay-${seed}-2`,
        type: "refund",
        status: "succeeded",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-REF`,
        createdAt: new Date(now - seed * 12 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
  if (paymentStatus === "partially_refunded") {
    return [
      {
        id: `pay-${seed}-1`,
        type: "charge",
        status: "succeeded",
        amount: total,
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-CHG`,
        createdAt: base,
      },
      {
        id: `pay-${seed}-2`,
        type: "refund",
        status: "succeeded",
        amount: Math.round(total / 2),
        currency: "IDR",
        provider: "midtrans",
        providerReference: `ORD-${seed}-REF`,
        createdAt: new Date(now - seed * 8 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
  return [];
}

function buildFulfillment(
  seed: number,
  fulfillmentStatus: AdminOrder["fulfillmentStatus"],
): FulfillmentEvent[] {
  const now = Date.now();
  const events: FulfillmentEvent[] = [];
  if (fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered") {
    events.push({
      id: `ful-${seed}-1`,
      type: "packed",
      status: "completed",
      createdAt: new Date(now - seed * 24 * 60 * 60 * 1000).toISOString(),
    });
    events.push({
      id: `ful-${seed}-2`,
      type: "shipped",
      status: "completed",
      trackingNumber: `JNE${seed}000${seed}`,
      carrier: "JNE",
      trackingUrl: `https://www.jne.co.id/tracking/${seed}`,
      createdAt: new Date(now - seed * 12 * 60 * 60 * 1000).toISOString(),
    });
  }
  if (fulfillmentStatus === "delivered") {
    events.push({
      id: `ful-${seed}-3`,
      type: "delivered",
      status: "completed",
      createdAt: new Date(now - seed * 6 * 60 * 60 * 1000).toISOString(),
    });
  }
  if (fulfillmentStatus === "fulfilled") {
    events.push({
      id: `ful-${seed}-1`,
      type: "packed",
      status: "completed",
      createdAt: new Date(now - seed * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return events;
}

const ORDER_SEEDS: Array<{
  status: AdminOrder["status"];
  paymentStatus: AdminOrder["paymentStatus"];
  fulfillmentStatus: AdminOrder["fulfillmentStatus"];
}> = [
  {
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
  },
  {
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
  },
  {
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
  },
  { status: "completed", paymentStatus: "paid", fulfillmentStatus: "shipped" },
  {
    status: "completed",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
  },
  {
    status: "cancelled",
    paymentStatus: "failed",
    fulfillmentStatus: "unfulfilled",
  },
  {
    status: "refunded",
    paymentStatus: "refunded",
    fulfillmentStatus: "unfulfilled",
  },
  {
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
  },
  {
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
  },
  {
    status: "completed",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
  },
  { status: "processing", paymentStatus: "paid", fulfillmentStatus: "shipped" },
  {
    status: "pending",
    paymentStatus: "partially_refunded",
    fulfillmentStatus: "unfulfilled",
  },
];

const MOCK_ADMIN_ORDERS: AdminOrder[] = Array.from({ length: 24 }, (_, idx) => {
  const seed = idx + 1;
  const template = ORDER_SEEDS[idx % ORDER_SEEDS.length]!;
  const customer = CUSTOMERS[idx % CUSTOMERS.length]!;
  const cityInfo = CITIES[idx % CITIES.length]!;
  const items = buildItems(seed);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const created = new Date(
    Date.now() - seed * 18 * 60 * 60 * 1000,
  ).toISOString();

  return {
    id: String(seed),
    orderNumber: `PA-${String(1000 + seed)}`,
    customerName: customer.name,
    customerEmail: customer.email,
    status: template.status,
    paymentStatus: template.paymentStatus,
    fulfillmentStatus: template.fulfillmentStatus,
    totalAmount,
    currency: "IDR",
    itemCount,
    createdAt: created,
    updatedAt: new Date(
      Date.now() - (seed % 5) * 6 * 60 * 60 * 1000,
    ).toISOString(),
    shippingAddress: {
      name: customer.name,
      address1: `Jl. Contoh No. ${seed}`,
      city: cityInfo.city,
      province: cityInfo.province,
      postalCode: cityInfo.postalCode,
      country: "Indonesia",
      phone: `0812${String(1000000 + seed * 7).slice(0, 7)}`,
    },
    billingAddress: {
      name: customer.name,
      address1: `Jl. Contoh No. ${seed}`,
      city: cityInfo.city,
      province: cityInfo.province,
      postalCode: cityInfo.postalCode,
      country: "Indonesia",
    },
    items,
    paymentHistory: buildPayments(seed, totalAmount, template.paymentStatus),
    fulfillmentHistory: buildFulfillment(seed, template.fulfillmentStatus),
  };
});

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

  let filtered = [...MOCK_ADMIN_ORDERS];

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
  return MOCK_ADMIN_ORDERS.find((o) => o.id === id) ?? null;
}

export async function getOrderStatusCounts(): Promise<{
  paymentPending: number;
  fulfillmentReady: number;
  blocked: number;
}> {
  return {
    paymentPending: MOCK_ADMIN_ORDERS.filter(
      (o) => o.paymentStatus === "pending",
    ).length,
    fulfillmentReady: MOCK_ADMIN_ORDERS.filter(
      (o) =>
        o.paymentStatus === "paid" && o.fulfillmentStatus === "unfulfilled",
    ).length,
    blocked: MOCK_ADMIN_ORDERS.filter(
      (o) => o.paymentStatus === "failed" || o.status === "cancelled",
    ).length,
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
  const order = MOCK_ADMIN_ORDERS.find((o) => o.id === id);
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

  return order;
}
