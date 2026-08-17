import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { registerLiveOrder, loadFileOrders, type AdminOrder } from "@/lib/admin/orders";

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    const fallbackEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "ihsanzz099@gmail.com";
    const fallbackName =
      clerkUser?.fullName ||
      (clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null) ||
      "Ihsan";

    const body = await request.json();
    const localOrders = (body.orders || []) as Array<{
      id?: string;
      orderNumber?: string;
      status?: string;
      total?: string | number;
      shippingCost?: string | number;
      createdAt?: string;
      trackingNumber?: string;
      shippingMethod?: string;
      customerEmail?: string;
      customerName?: string;
      shippingAddress?: {
        recipientName?: string;
        phone?: string;
        email?: string;
        addressLine1?: string;
        city?: string;
        province?: string;
        postalCode?: string;
      };
      items?: Array<{
        id?: string;
        quantity?: number;
        price?: string | number;
        subtotal?: string | number;
        product?: {
          id?: string;
          name?: string;
          image?: string;
        };
      }>;
    }>;

    for (const ord of localOrders) {
      if (!ord) continue;
      const orderNum = ord.orderNumber || ord.id || ("PA-" + Date.now().toString().slice(-6));
      const orderId = ord.id || orderNum;

      const realCustomerEmail =
        ord.customerEmail ||
        ord.shippingAddress?.email ||
        fallbackEmail;

      const realCustomerName =
        ord.customerName ||
        ord.shippingAddress?.recipientName ||
        fallbackName;

      const orderStat =
        ord.status === "PENDING_PAYMENT"
          ? "pending"
          : ord.status === "PAID" || ord.status === "PROCESSING"
          ? "processing"
          : ord.status === "DELIVERED"
          ? "completed"
          : ord.status === "CANCELLED"
          ? "cancelled"
          : ord.status === "REFUNDED"
          ? "refunded"
          : "processing";

      const paymentStat =
        ord.status === "PAID" || ord.status === "PROCESSING" || ord.status === "SHIPPED" || ord.status === "DELIVERED"
          ? "paid"
          : ord.status === "REFUNDED"
          ? "refunded"
          : ord.status === "CANCELLED"
          ? "failed"
          : "pending";

      const fulfillmentStat =
        ord.status === "DELIVERED"
          ? "delivered"
          : ord.status === "SHIPPED"
          ? "shipped"
          : ord.status === "PROCESSING"
          ? "fulfilled"
          : "unfulfilled";

      const adminOrder: AdminOrder = {
        id: orderId,
        orderNumber: orderNum,
        customerName: realCustomerName,
        customerEmail: realCustomerEmail,
        status: orderStat,
        paymentStatus: paymentStat,
        fulfillmentStatus: fulfillmentStat,
        totalAmount: Number(ord.total) || 121000,
        currency: "IDR",
        itemCount: ord.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1,
        createdAt: ord.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: {
          name: realCustomerName,
          address1: ord.shippingAddress?.addressLine1 || "Jl. Margorejo Indah No. 12",
          city: ord.shippingAddress?.city || "Surabaya",
          province: ord.shippingAddress?.province || "Jawa Timur",
          postalCode: ord.shippingAddress?.postalCode || "60238",
          country: "Indonesia",
          phone: ord.shippingAddress?.phone || "08123456789",
        },
        items: (ord.items || []).map((i, idx) => ({
          id: i.id || `itm-${idx}`,
          productId: i.product?.id || `prod-${idx}`,
          productName: i.product?.name || "Buku Pena Ameen",
          productSlug: "buku-pena-ameen",
          quantity: i.quantity || 1,
          unitPrice: Number(i.price) || 121000,
          totalPrice: Number(i.subtotal) || (Number(i.price) || 121000) * (i.quantity || 1),
        })),
        paymentHistory: [
          {
            id: `pay-${orderId}`,
            type: "payment_intent",
            status: paymentStat === "paid" ? "succeeded" : "pending",
            amount: Number(ord.total) || 121000,
            currency: "IDR",
            provider: "midtrans",
            providerReference: orderNum,
            createdAt: ord.createdAt || new Date().toISOString(),
          },
        ],
        fulfillmentHistory: [
          {
            id: `ful-${orderId}`,
            type: "shipped",
            status: fulfillmentStat === "unfulfilled" ? "pending" : "completed",
            carrier: ord.shippingMethod || "JNE",
            trackingNumber: ord.trackingNumber || `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            createdAt: ord.createdAt || new Date().toISOString(),
          },
        ],
      };

      registerLiveOrder(adminOrder);
    }

    const allOrders = loadFileOrders();
    return NextResponse.json({ success: true, count: allOrders.length, orders: allOrders });
  } catch (error) {
    console.error("Error syncing orders:", error);
    return NextResponse.json({ error: "Failed to sync orders" }, { status: 500 });
  }
}
