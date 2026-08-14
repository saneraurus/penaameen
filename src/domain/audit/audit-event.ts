import type {
  ActorId,
  CorrelationId,
  ResourceId,
} from "@/domain/common/identifiers";

export type AuditActorKind = "system" | "customer" | "staff";

export type AuditEvent = {
  readonly actorKind: AuditActorKind;
  readonly actorId?: ActorId;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: ResourceId;
  readonly outcome: "succeeded" | "denied" | "failed" | "pending";
  readonly correlationId: CorrelationId;
  readonly occurredAt: Date;
  readonly reason?: string;
};
