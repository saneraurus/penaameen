import { requireStaffActor } from "@/application/auth/clerk-auth";
import { staffPrisma } from "@/lib/prisma-staff";
import { ConsoleLogger } from "@/infrastructure/observability/console-logger";
import { createCorrelationId } from "@/domain/common/identifiers";
import type { Prisma } from "@/generated/prisma";

export interface StaffContext {
  correlationId: string;
  staffActor: Awaited<ReturnType<typeof requireStaffActor>>;
}

const logger = new ConsoleLogger();
type StaffTransaction = Prisma.TransactionClient;

export async function withStaffContext<T>(
  requiredCapability: string,
  operation: (context: StaffContext, tx: StaffTransaction) => Promise<T>,
): Promise<T> {
  if (process.env.RLS_ENABLED !== "true") {
    throw new Error("RLS_ENABLED must be true before using staff context");
  }

  const correlationId = createCorrelationId("staff");

  const staffActor = await requireStaffActor(requiredCapability);

  logger.write({
    timestamp: new Date().toISOString(),
    level: "info",
    operation: "staff-context",
    correlationId,
    message: "Staff context established",
    context: {
      staffId: staffActor.staffId,
      orgRole: staffActor.orgRole,
      capability: requiredCapability,
    },
  });

  return staffPrisma.$transaction(async (tx) => {
    const context: StaffContext = {
      correlationId,
      staffActor,
    };
    return operation(context, tx);
  });
}

export async function withStaffContextOptional<T>(
  capability: string | undefined,
  operation: (context: StaffContext | null, tx: StaffTransaction) => Promise<T>,
): Promise<T> {
  const correlationId = createCorrelationId("staff-optional");

  let staffActor: Awaited<ReturnType<typeof requireStaffActor>> | null = null;

  if (capability) {
    try {
      staffActor = await requireStaffActor(capability);
    } catch {
      staffActor = null;
    }
  }

  logger.write({
    timestamp: new Date().toISOString(),
    level: "info",
    operation: "staff-context",
    correlationId,
    message: "Staff context (optional) established",
    context: {
      staffId: staffActor?.staffId ?? null,
      capability: capability ?? null,
    },
  });

  return staffPrisma.$transaction(async (tx) => {
    const context: StaffContext | null = staffActor
      ? { correlationId, staffActor }
      : null;
    return operation(context, tx);
  });
}
