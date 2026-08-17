import type { AuditStore } from "@/application/audit/audit-store";
import { PrismaAuditStore } from "@/infrastructure/audit/prisma-audit-store";
import { FileAuditStore } from "@/infrastructure/audit/file-audit-store";

const prismaStore = new PrismaAuditStore();
const fileStore = new FileAuditStore();

// Prisma-first with append-only file fallback, consistent with the
// repository-wide pattern for offline/development environments.
export function getAuditStore(): AuditStore {
  return {
    isAvailable: true,
    append: (event) =>
      prismaStore.append(event).catch(() => fileStore.append(event)),
    list: async (options) => {
      try {
        return await prismaStore.list(options);
      } catch {
        return fileStore.list(options);
      }
    },
  };
}

export const auditStore = getAuditStore();
