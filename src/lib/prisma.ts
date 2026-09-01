import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getPgPool(): Pool {
  if (!globalForPrisma.pgPool) {
    const pool = new Pool({
      connectionString: process.env["SUPABASE_DB_URL"],
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 4000,
    });
    pool.on("error", (err) => {
      console.warn("[pgPool background error]", err.message);
    });
    globalForPrisma.pgPool = pool;
  }
  return globalForPrisma.pgPool;
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(getPgPool());
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

// Defer PrismaClient construction until first use so that importing this module
// (e.g. during `next build` route data collection) does not require a configured
// database driver adapter. Real construction happens on the first request.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    return Reflect.get(getPrismaClient(), prop, receiver);
  },
});

export default prisma;
