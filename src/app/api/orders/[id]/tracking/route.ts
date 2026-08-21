import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TRACKING_URLS: Record<string, string> = {
  jne: "https://www.jne.co.id/en/tracking/trace",
  jnt: "https://www.jet.co.id/track",
  pos: "https://www.posindonesia.co.id/id/tracking",
  sicepat: "https://www.sicepat.com/checkAwb",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authObj = await auth();
    if (!authObj?.userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: authObj.userId },
      select: { id: true },
    });
    if (!user)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        OR: [{ id }, { orderNumber: id }],
      },
      select: { trackingNumber: true, shippingMethod: true, status: true },
    });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.trackingNumber) {
      return NextResponse.json({
        status: "not_available",
        trackingNumber: null,
        message: "Nomor resi belum tersedia.",
      });
    }

    const courier = (order.shippingMethod || "").toLowerCase();
    const courierKey = Object.keys(TRACKING_URLS).find((key) =>
      courier.includes(key),
    );

    return NextResponse.json({
      status: "tracking_number_available",
      trackingNumber: order.trackingNumber,
      orderStatus: order.status,
      trackingUrl: courierKey ? TRACKING_URLS[courierKey] : null,
      message: courierKey
        ? "Gunakan situs resmi kurir untuk melihat status terbaru."
        : "Status live kurir belum tersedia dari provider.",
    });
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json(
      { error: "Gagal mengambil status tracking" },
      { status: 500 },
    );
  }
}
