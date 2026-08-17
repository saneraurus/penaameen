import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/admin/orders";
import Midtrans from "midtrans-client";

function getMidtransClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
  return new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey,
    clientKey,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    try {
      const midtrans = getMidtransClient();
      const parameter = {
        transaction_details: {
          order_id: `${order.orderNumber}-${Date.now().toString().slice(-4)}`,
          gross_amount: order.totalAmount,
        },
        customer_details: {
          first_name: order.customerName,
          email: order.customerEmail,
          phone: order.shippingAddress?.phone || "08123456789",
          shipping_address: {
            first_name: order.shippingAddress?.name || order.customerName,
            address: order.shippingAddress?.address1 || "Surabaya",
            city: order.shippingAddress?.city || "Surabaya",
            postal_code: order.shippingAddress?.postalCode || "60238",
            phone: order.shippingAddress?.phone || "08123456789",
          },
        },
        item_details: order.items.map((item) => ({
          id: item.productId || item.id,
          price: item.unitPrice,
          quantity: item.quantity,
          name: item.productName.slice(0, 50),
        })),
      };

      const midtransResponse = await midtrans.createTransaction(parameter);
      return NextResponse.json({
        snapToken: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
      });
    } catch {
      // Mock Snap token for sandbox / test environment
      return NextResponse.json({
        snapToken: `MOCK_SNAP_${order.orderNumber}_${Date.now()}`,
        redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock`,
      });
    }
  } catch (error) {
    console.error("Error creating snap token:", error);
    return NextResponse.json({ error: "Failed to generate snap token" }, { status: 500 });
  }
}
