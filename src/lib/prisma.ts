import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
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
