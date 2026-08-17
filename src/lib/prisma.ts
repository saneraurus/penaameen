import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(
      new Pool({
        connectionString: process.env["DATABASE_URL"],
        // Force UTF-8 client encoding. Windows PostgreSQL defaults to the
        // locale encoding (WIN1252), which rejects characters such as U+2011
        // (non-breaking hyphen) emitted by AI providers with "22P05".
        options: "-c client_encoding=UTF8",
      }),
    );
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
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
