import type {
  ActorId,
  CorrelationId,
  ResourceId,
} from "@/domain/common/identifiers";

export type AuditActorKind = "system" | "customer" | "staff";

export type AuditOutcome = "succeeded" | "denied" | "failed" | "pending";

export type AuditEvent = {
  readonly actorKind: AuditActorKind;
  readonly actorId?: ActorId;
  readonly actorEmail?: string;
  readonly actorRole?: string;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: ResourceId;
  readonly outcome: AuditOutcome;
  readonly correlationId: CorrelationId;
  readonly occurredAt: Date;
  readonly before?: unknown;
  readonly after?: unknown;
  readonly reason?: string;
  readonly ipAddress?: string;
};

export type AuditEventInput = Omit<AuditEvent, "correlationId" | "occurredAt"> &
  Partial<Pick<AuditEvent, "correlationId" | "occurredAt">>;

export type AuditRecord = AuditEventInput & {
  readonly id: string;
  readonly occurredAt: Date;
};
