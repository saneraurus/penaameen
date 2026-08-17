import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getApiSettings } from "@/lib/admin/api-settings";
import { prisma } from "@/lib/prisma";

type TestResult = {
  success: boolean;
  message: string;
  latencyMs: number;
};

async function testMidtrans(
  serverKey: string,
  isProduction: boolean,
): Promise<TestResult> {
  const started = Date.now();
  if (!serverKey) {
    return {
      success: false,
      message: "Server Key Midtrans belum dikonfigurasi.",
      latencyMs: Date.now() - started,
    };
  }

  let orderId: string | null = null;
  try {
    const latest = await prisma.order.findFirst({
      where: { midtransOrderId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { midtransOrderId: true },
    });
    orderId = latest?.midtransOrderId ?? null;
  } catch {
    // DB unavailable: verification cannot run without a reference order.
  }

  if (!orderId) {
    return {
      success: false,
      message:
        "Verifikasi live memerlukan order referensi dengan Midtrans Order ID. Belum ada order yang dapat diverifikasi.",
      latencyMs: Date.now() - started,
    };
  }

  try {
    const base = isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.veritrans.co.id";
    const response = await fetch(`${base}/v2/${orderId}/status`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
        Accept: "application/json",
      },
    });
    if (response.ok) {
      return {
        success: true,
        message: `Koneksi Midtrans (${isProduction ? "Production" : "Sandbox"}) terverifikasi via order ${orderId}.`,
        latencyMs: Date.now() - started,
      };
    }
    return {
      success: false,
      message: `Midtrans merespons dengan status ${response.status}. Periksa Server Key.`,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menghubungi Midtrans: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      latencyMs: Date.now() - started,
    };
  }
}

async function testRajaOngkir(apiKey: string): Promise<TestResult> {
  const started = Date.now();
  if (!apiKey) {
    return {
      success: false,
      message: "API Key RajaOngkir belum dikonfigurasi.",
      latencyMs: Date.now() - started,
    };
  }

  try {
    const response = await fetch(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: { key: apiKey },
      },
    );
    if (response.ok) {
      return {
        success: true,
        message:
          "Koneksi RajaOngkir terverifikasi (daftar provinsi berhasil diambil).",
        latencyMs: Date.now() - started,
      };
    }
    return {
      success: false,
      message: `RajaOngkir merespons dengan status ${response.status}. Periksa API Key dan tier.`,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menghubungi RajaOngkir: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      latencyMs: Date.now() - started,
    };
  }
}

async function testEmail(apiKey: string): Promise<TestResult> {
  const started = Date.now();
  if (!apiKey) {
    return {
      success: false,
      message: "API Key email (Resend) belum dikonfigurasi.",
      latencyMs: Date.now() - started,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (response.ok || response.status === 200) {
      return {
        success: true,
        message:
          "Koneksi Resend terverifikasi (daftar email berhasil diambil).",
        latencyMs: Date.now() - started,
      };
    }
    return {
      success: false,
      message: `Resend merespons dengan status ${response.status}. Periksa API Key.`,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      success: false,
      message: `Gagal menghubungi Resend: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      latencyMs: Date.now() - started,
    };
  }
}

export async function POST(request: Request) {
  try {
    await requireStaffActor("access:write");
    const body = await request.json();
    const service = body.service as "midtrans" | "rajaongkir" | "email";
    const settings = getApiSettings();

    if (service === "midtrans") {
      const result = await testMidtrans(
        settings.midtrans.serverKey,
        settings.midtrans.isProduction,
      );
      return NextResponse.json(result);
    }

    if (service === "rajaongkir") {
      const result = await testRajaOngkir(settings.rajaongkir.apiKey);
      return NextResponse.json(result);
    }

    if (service === "email") {
      const result = await testEmail(settings.autoEmail.apiKey);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: "Layanan tidak dikenal" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error testing service:", error);
    return NextResponse.json(
      { error: "Failed to test API connection" },
      { status: 500 },
    );
  }
}
