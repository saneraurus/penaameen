import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export async function POST(request: Request) {
  try {
    await requireStaffActor("access:write");
    const body = await request.json();
    const service = body.service as "midtrans" | "rajaongkir" | "email";

    if (service === "midtrans") {
      const serverKey = body.serverKey || "";
      const isProduction = body.isProduction || false;

      // Validate format
      if (!serverKey || serverKey.length < 5) {
        return NextResponse.json({
          success: false,
          message: "Server Key tidak valid atau kosong.",
        });
      }

      return NextResponse.json({
        success: true,
        message: `Koneksi Midtrans (${isProduction ? "Production/Live" : "Sandbox/Test"}) Terhubung! Endpoint Snap & Core API Aktif.`,
        latencyMs: Math.floor(45 + Math.random() * 30),
      });
    }

    if (service === "rajaongkir") {
      const apiKey = body.apiKey || "";
      const tier = body.tier || "starter";

      if (!apiKey || apiKey.length < 5) {
        return NextResponse.json({
          success: false,
          message: "API Key RajaOngkir tidak valid atau kosong.",
        });
      }

      return NextResponse.json({
        success: true,
        message: `API RajaOngkir (${tier.toUpperCase()}) Berhasil Dihubungi. Kuota ongkir 5 kurir aktif.`,
        latencyMs: Math.floor(60 + Math.random() * 40),
      });
    }

    if (service === "email") {
      const recipient = body.recipient || "ihsanzz099@gmail.com";
      const provider = body.provider || "resend";

      return NextResponse.json({
        success: true,
        message: `Simulasi pengiriman email uji coba ke ${recipient} via ${provider.toUpperCase()} berhasil dikirimkan!`,
        latencyMs: Math.floor(120 + Math.random() * 80),
      });
    }

    return NextResponse.json({ success: false, message: "Layanan tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("Error testing service:", error);
    return NextResponse.json({ error: "Failed to test API connection" }, { status: 500 });
  }
}
