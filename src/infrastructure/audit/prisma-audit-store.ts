import type { AuditEventInput, AuditRecord } from "@/domain/audit/audit-event";
import type {
  AuditListOptions,
  AuditListResult,
  AuditStore,
} from "@/application/audit/audit-store";
import type {
  ActorId,
  CorrelationId,
  ResourceId,
} from "@/domain/common/identifiers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export class PrismaAuditStore implements AuditStore {
  readonly isAvailable = true;

  async append(event: AuditEventInput): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorKind: event.actorKind,
        actorId: event.actorId ?? null,
        actorEmail: event.actorEmail ?? null,
        actorRole: event.actorRole ?? null,
        action: event.action,
        targetType: event.targetType,
        targetId: event.targetId,
        outcome: event.outcome,
        correlationId: event.correlationId ?? null,
        before:
          event.before === undefined
            ? Prisma.JsonNull
            : (event.before as Prisma.InputJsonValue),
        after:
          event.after === undefined
            ? Prisma.JsonNull
            : (event.after as Prisma.InputJsonValue),
        reason: event.reason ?? null,
        ipAddress: event.ipAddress ?? null,
        occurredAt: event.occurredAt ?? new Date(),
      },
    });
  }

  async list(options: AuditListOptions): Promise<AuditListResult> {
    const { page, perPage, action, targetType, actorId, outcome, from, to } =
      options;

    const where: Record<string, unknown> = {};
    if (action) where.action = action;
    if (targetType) where.targetType = targetType;
    if (actorId) where.actorId = actorId;
    if (outcome) where.outcome = outcome;
    if (from || to) {
      where.occurredAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.auditLog.count({ where }),
    ]);

    const events: AuditRecord[] = rows.map((row) => {
      const base = {
        id: row.id,
        actorKind: row.actorKind as AuditEventInput["actorKind"],
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId as ResourceId,
        outcome: row.outcome as AuditEventInput["outcome"],
        occurredAt: row.occurredAt,
      } as const;

      const record: AuditRecord = {
        ...base,
        ...(row.actorId ? { actorId: row.actorId as ActorId } : {}),
        ...(row.actorEmail ? { actorEmail: row.actorEmail } : {}),
        ...(row.actorRole ? { actorRole: row.actorRole } : {}),
        ...(row.correlationId
          ? { correlationId: row.correlationId as CorrelationId }
          : {}),
        ...(row.before !== null ? { before: row.before as object } : {}),
        ...(row.after !== null ? { after: row.after as object } : {}),
        ...(row.reason ? { reason: row.reason } : {}),
        ...(row.ipAddress ? { ipAddress: row.ipAddress } : {}),
      };
      return record;
    });

    return { events, total };
  }
}
