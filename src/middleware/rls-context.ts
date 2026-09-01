import { auth } from "@clerk/nextjs/server";
import { ConsoleLogger } from "@/infrastructure/observability/console-logger";
import { createCorrelationId } from "@/domain/common/identifiers";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface RLSContext {
  correlationId: string;
  actorKind: "customer" | "public" | "system";
  clerkUserId: string | null;
  internalUserId: string | null;
}

const logger = new ConsoleLogger();

type RlsTransaction = Prisma.TransactionClient;

export async function getCurrentUserId(
  tx: RlsTransaction,
): Promise<string | null> {
  const user = await tx.user.findFirst({ select: { id: true } });
  return user?.id ?? null;
}

export async function withRLSContext<T>(
  operation: (context: RLSContext, tx: RlsTransaction) => Promise<T>,
): Promise<T> {
  if (process.env.RLS_ENABLED !== "true") {
    throw new Error("RLS_ENABLED must be true before using RLS context");
  }

  const correlationId = createCorrelationId("rls");

  let clerkUserId: string | null = null;
  const internalUserId: string | null = null;
  let actorKind: "customer" | "public" | "system" = "public";

  try {
    const authObj = await auth();
    clerkUserId = authObj?.userId ?? null;
  } catch {
    clerkUserId = null;
  }

  if (clerkUserId) {
    actorKind = "customer";
    // The database policy is keyed by Clerk's immutable subject. Do not
    // resolve the internal cuid outside the transaction, because that query
    // is intentionally protected by the same RLS policy.
  }

  logger.write({
    timestamp: new Date().toISOString(),
    level: "info",
    operation: "rls-context",
    correlationId,
    message: "RLS context established",
    context: { actorKind, clerkUserId, internalUserId },
  });

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SET LOCAL "app.current_clerk_id" = ${clerkUserId ?? ""}`;
      await tx.$executeRaw`SET LOCAL "app.actor_kind" = 'customer'`;

      const context: RLSContext = {
        correlationId,
        actorKind,
        clerkUserId,
        internalUserId,
      };

      return operation(context, tx);
    },
    { maxWait: 10000, timeout: 15000 },
  );
}

export async function withSystemRLSContext<T>(
  operation: (context: RLSContext, tx: RlsTransaction) => Promise<T>,
): Promise<T> {
  const correlationId = createCorrelationId("rls-system");

  const context: RLSContext = {
    correlationId,
    actorKind: "system",
    clerkUserId: null,
    internalUserId: null,
  };

  logger.write({
    timestamp: new Date().toISOString(),
    level: "info",
    operation: "rls-context",
    correlationId,
    message: "System RLS context established",
    context: { actorKind: "system" },
  });

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SET LOCAL "app.current_clerk_id" = ''`;
      await tx.$executeRaw`SET LOCAL "app.actor_kind" = 'system'`;
      return operation(context, tx);
    },
    { maxWait: 10000, timeout: 15000 },
  );
}

export async function withWorkerRLSContext<T>(
  operation: (tx: RlsTransaction) => Promise<T>,
): Promise<T> {
  if (process.env.RLS_ENABLED !== "true") {
    throw new Error("RLS_ENABLED must be true before using worker context");
  }

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SET LOCAL "app.current_clerk_id" = ''`;
      await tx.$executeRaw`SET LOCAL "app.actor_kind" = 'system'`;
      return operation(tx);
    },
    { maxWait: 10000, timeout: 15000 },
  );
}

export async function withStaffRLSContext<T>(
  operation: (tx: RlsTransaction) => Promise<T>,
): Promise<T> {
  const correlationId = createCorrelationId("rls-staff");

  logger.write({
    timestamp: new Date().toISOString(),
    level: "info",
    operation: "rls-context",
    correlationId,
    message: "Staff RLS context established",
  });

  const { staffPrisma } = await import("@/lib/prisma-staff");
  return staffPrisma.$transaction((tx) => operation(tx));
}
