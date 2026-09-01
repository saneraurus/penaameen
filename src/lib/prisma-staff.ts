import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForStaffPrisma = globalThis as unknown as {
  staffPrisma: PrismaClient | undefined;
};

function getStaffPrismaClient(): PrismaClient {
  if (!globalForStaffPrisma.staffPrisma) {
    const connectionString = process.env.DATABASE_STAFF_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_STAFF_URL is required for staff database operations",
      );
    }

    const adapter = new PrismaPg(
      new Pool({
        connectionString,
        options: "-c client_encoding=UTF8",
      }),
    );
    globalForStaffPrisma.staffPrisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }
  return globalForStaffPrisma.staffPrisma;
}

export const staffPrisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    return Reflect.get(getStaffPrismaClient(), prop, receiver);
  },
});

export default staffPrisma;
