import type { AuditEventInput, AuditRecord } from "@/domain/audit/audit-event";
import type { StaffActor } from "@/application/auth/clerk-auth";

export type AuditListOptions = {
  readonly page: number;
  readonly perPage: number;
  readonly action?: string;
  readonly targetType?: string;
  readonly actorId?: string;
  readonly outcome?: string;
  readonly from?: string;
  readonly to?: string;
};

export type AuditListResult = {
  readonly events: AuditRecord[];
  readonly total: number;
};

export interface AuditStore {
  append(event: AuditEventInput): Promise<void>;
  list(options: AuditListOptions): Promise<AuditListResult>;
  readonly isAvailable: boolean;
}

export type StaffAuditContext = Pick<
  StaffActor,
  "staffId" | "email" | "fullName" | "orgRole"
>;

export function recordStaffAudit(
  store: AuditStore,
  actor: StaffAuditContext,
  input: Omit<
    AuditEventInput,
    "actorKind" | "actorId" | "actorEmail" | "actorRole"
  >,
): Promise<void> {
  return store.append({
    ...input,
    actorKind: "staff",
    actorId: actor.staffId,
    actorEmail: actor.email,
    actorRole: actor.orgRole,
  });
}

export function recordSystemAudit(
  store: AuditStore,
  input: Omit<AuditEventInput, "actorKind">,
): Promise<void> {
  return store.append({ ...input, actorKind: "system" });
}

export async function safeRecordAudit(
  store: AuditStore,
  event: AuditEventInput,
): Promise<void> {
  try {
    await store.append(event);
  } catch (error) {
    console.warn("[Audit] Failed to record audit event:", error);
  }
}
