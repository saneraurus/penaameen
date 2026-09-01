import { NextResponse } from "next/server";
import {
  parseBuatQrisWebhookPayload,
  verifyBuatQrisWebhookSignature,
} from "@/lib/payment/buatqris";
import { applyBuatQrisEvent } from "@/lib/payment/buatqris-service";
import { getApiSettings } from "@/lib/admin/api-settings";
import { isSystemControlEnabled } from "@/lib/admin/system-controls";
import { createNotification } from "@/lib/admin/notifications";
import { auditStore } from "@/infrastructure/audit";
import { recordSystemAudit } from "@/application/audit/audit-store";
import { createResourceId } from "@/domain/common/identifiers";
import { withSystemRLSContext } from "@/middleware/rls-context";

export async function POST(request: Request) {
  // Raw body is required for HMAC verification — never re-serialize JSON.
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-buatqris-signature") ??
    request.headers.get("x-signature") ??
    "";
  const eventHeader = request.headers.get("x-buatqris-event");
  const deliveryHeader = request.headers.get("x-buatqris-delivery");

  const settings = getApiSettings();
  const secret = settings.buatqris.secretToken;

  if (!secret) {
    console.error("BUATQRIS_SECRET_TOKEN not configured");
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }

  if (!verifyBuatQrisWebhookSignature(rawBody, signature, secret)) {
    console.error("Invalid BuatQRIS signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Emergency kill-switch: stop processing payment webhooks entirely.
  if (await isSystemControlEnabled("disable_payment_webhook_processing")) {
    console.warn("Webhook processing disabled by emergency control (buatqris)");
    return NextResponse.json(
      { error: "Webhook processing temporarily disabled" },
      { status: 503 },
    );
  }

  try {
    const payload = parseBuatQrisWebhookPayload(
      rawBody,
      eventHeader,
      deliveryHeader,
    );
    const outcome = await withSystemRLSContext((_context, tx) =>
      applyBuatQrisEvent(
        {
          transactionId: payload.transactionId,
          ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
          ...(payload.totalAmount !== undefined
            ? { totalAmount: payload.totalAmount }
            : {}),
          status: payload.status,
        },
        "webhook",
        tx,
      ),
    );

    return NextResponse.json({ success: true, outcome });
  } catch (error) {
    console.error("Error processing BuatQRIS webhook:", error);

    await createNotification({
      type: "webhook.failed",
      severity: "critical",
      title: "Webhook BuatQRIS gagal diproses",
      message: error instanceof Error ? error.message : "Error tidak diketahui",
      targetType: "webhook",
      targetId: "buatqris",
    });

    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "webhook",
      targetId: createResourceId("buatqris"),
      outcome: "failed",
      after: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "buatqris-webhook",
    status: "ready",
    timestamp: new Date().toISOString(),
  });
}
