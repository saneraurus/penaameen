import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  SYSTEM_CONTROL_KEYS,
  getSystemControls,
  setSystemControl,
  type SystemControlKey,
} from "@/lib/admin/system-controls";

export async function GET() {
  try {
    await requireStaffActor("system:control");
    const controls = await getSystemControls();
    return NextResponse.json({ controls });
  } catch (error) {
    console.error("Error fetching system controls:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    requireRequestOrigin(request);
    const actor = await requireStaffActor("system:control");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );

    const body = await request.json();
    const key = body.key as SystemControlKey;
    const value = Boolean(body.value);
    const confirmed = Boolean(body.confirm);

    if (!SYSTEM_CONTROL_KEYS.includes(key)) {
      return NextResponse.json(
        { error: "Unknown system control key" },
        { status: 422 },
      );
    }

    // Destructive/emergency actions require explicit confirmation.
    if (!confirmed) {
      return NextResponse.json(
        { error: "Confirmation required for emergency control changes" },
        { status: 400 },
      );
    }

    const before = await getSystemControls();
    const updated = await setSystemControl(key, value, actor.staffId);

    await recordStaffAudit(auditStore, actor, {
      action: "system.control",
      targetType: "system_control",
      targetId: createResourceId(key),
      outcome: "succeeded",
      correlationId,
      before: { value: before.find((c) => c.key === key)?.value ?? false },
      after: { value: updated.value },
      reason: "Emergency control changed with confirmation",
    });

    return NextResponse.json({ success: true, control: updated });
  } catch (error) {
    console.error("Error setting system control:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
