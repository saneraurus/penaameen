import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  getApiSettings,
  getPublicApiSettings,
  saveApiSettings,
  type ApiSettings,
} from "@/lib/admin/api-settings";

export async function GET() {
  try {
    await requireStaffActor("access:read");
    const settings = getPublicApiSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching API settings:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch settings" },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireRequestOrigin(request);
    const actor = await requireStaffActor("access:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const body = await request.json();
    const current = getApiSettings();

    const merged: ApiSettings = {
      midtrans: {
        ...current.midtrans,
        ...(body.midtrans || {}),
      },
      rajaongkir: {
        ...current.rajaongkir,
        ...(body.rajaongkir || {}),
      },
      autoEmail: {
        ...current.autoEmail,
        ...(body.autoEmail || {}),
      },
      emailForwarding: {
        ...current.emailForwarding,
        ...(body.emailForwarding || {}),
      },
      clerkAuth: {
        ...current.clerkAuth,
        ...(body.clerkAuth || {}),
      },
      casaku: {
        ...current.casaku,
        ...(body.casaku || {}),
      },
    };

    const before = getPublicApiSettings();
    saveApiSettings(merged);
    const after = getPublicApiSettings();

    await recordStaffAudit(auditStore, actor, {
      action: "settings.api.update",
      targetType: "settings",
      targetId: createResourceId("api"),
      outcome: "succeeded",
      correlationId,
      before: {
        midtransIsProduction: before.midtrans.isProduction,
        rajaongkirTier: before.rajaongkir.tier,
        autoEmailProvider: before.autoEmail.provider,
        casakuEnabled: before.casaku.enabled,
      },
      after: {
        midtransIsProduction: after.midtrans.isProduction,
        rajaongkirTier: after.rajaongkir.tier,
        autoEmailProvider: after.autoEmail.provider,
        casakuEnabled: after.casaku.enabled,
      },
      reason: "API/integration settings changed (secrets masked in audit)",
    });

    return NextResponse.json({ success: true, settings: after });
  } catch (error) {
    console.error("Error saving API settings:", error);
    return NextResponse.json(
      { error: "Failed to save API settings" },
      { status: 500 },
    );
  }
}
