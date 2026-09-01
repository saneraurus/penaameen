import { NextResponse } from "next/server";
import {
  parseCasakuWebhookPayload,
  verifyCasakuWebhookSignature,
} from "@/lib/payment/casaku";
import { applyCasakuEvent } from "@/lib/payment/casaku-service";
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
  const signature = request.headers.get("x-casaku-signature") ?? "";

  const settings = getApiSettings();
  const secret = settings.casaku.webhookSecret;

  if (!secret) {
    console.error("CASAKU_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }

  if (!verifyCasakuWebhookSignature(rawBody, signature, secret)) {
    console.error("Invalid Casaku signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Emergency kill-switch: stop processing payment webhooks entirely.
  if (await isSystemControlEnabled("disable_payment_webhook_processing")) {
    console.warn("Webhook processing disabled by emergency control (casaku)");
    return NextResponse.json(
      { error: "Webhook processing temporarily disabled" },
      { status: 503 },
    );
  }

  try {
    const payload = parseCasakuWebhookPayload(rawBody);
    const outcome = await withSystemRLSContext((_context, tx) =>
      applyCasakuEvent(
        {
          transactionId: payload.transactionId,
          amount: payload.amount,
          status: payload.status,
        },
        "webhook",
        tx,
      ),
    );

    return NextResponse.json({ success: true, outcome });
  } catch (error) {
    console.error("Error processing Casaku webhook:", error);

    await createNotification({
      type: "webhook.failed",
      severity: "critical",
      title: "Webhook Casaku gagal diproses",
      message: error instanceof Error ? error.message : "Error tidak diketahui",
      targetType: "webhook",
      targetId: "casaku",
    });

    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "webhook",
      targetId: createResourceId("casaku"),
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
