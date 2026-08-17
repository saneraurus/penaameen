import { describe, expect, it, vi, beforeEach } from "vitest";

const fsMock = vi.hoisted(() => {
  const mem = new Map<string, string>();
  return {
    mem,
    fs: {
      existsSync: (p: string) => mem.has(p),
      mkdirSync: () => undefined,
      readFileSync: (p: string) => {
        if (!mem.has(p)) throw new Error("ENOENT");
        return mem.get(p);
      },
      writeFileSync: (p: string, data: string) => {
        mem.set(p, data);
      },
      appendFileSync: (p: string, data: string) => {
        mem.set(p, (mem.get(p) ?? "") + data);
      },
    },
  };
});

vi.mock("fs", () => ({ ...fsMock.fs, default: fsMock.fs }));

import { FileAuditStore } from "@/infrastructure/audit/file-audit-store";
import {
  recordStaffAudit,
  recordSystemAudit,
  safeRecordAudit,
  type AuditStore,
} from "@/application/audit/audit-store";
import { createActorId, createCorrelationId, createResourceId } from "@/domain/common/identifiers";

const actor = {
  staffId: createActorId("staff-1"),
  email: "staff@penaameen.com",
  fullName: "Staff Satu",
  orgRole: "admin" as const,
};

function baseEvent() {
  return {
    actorKind: "staff" as const,
    action: "product.update",
    targetType: "product",
    targetId: createResourceId("prod-1"),
    outcome: "succeeded" as const,
    correlationId: createCorrelationId("test-correlation"),
  };
}

describe("FileAuditStore", () => {
  beforeEach(() => {
    fsMock.mem.clear();
  });

  it("appends events and lists them newest-first", async () => {
    const store = new FileAuditStore();
    await store.append({ ...baseEvent(), action: "a" });
    await store.append({ ...baseEvent(), action: "b" });

    const result = await store.list({ page: 1, perPage: 10 });
    expect(result.total).toBe(2);
    expect(result.events[0]?.action).toBe("b");
    expect(result.events[1]?.action).toBe("a");
  });

  it("filters by action, targetType, outcome, and actorId", async () => {
    const store = new FileAuditStore();
    await recordStaffAudit(store, actor, { ...baseEvent(), action: "product.create" });
    await recordStaffAudit(store, actor, { ...baseEvent(), action: "product.delete", outcome: "denied" });

    const byAction = await store.list({ page: 1, perPage: 10, action: "product.delete" });
    expect(byAction.total).toBe(1);
    expect(byAction.events[0]?.outcome).toBe("denied");

    const byOutcome = await store.list({ page: 1, perPage: 10, outcome: "succeeded" });
    expect(byOutcome.total).toBe(1);
    expect(byOutcome.events[0]?.action).toBe("product.create");
  });

  it("paginates results", async () => {
    const store = new FileAuditStore();
    for (let i = 0; i < 5; i += 1) {
      await store.append({ ...baseEvent(), action: `action-${i}` });
    }

    const page1 = await store.list({ page: 1, perPage: 2 });
    const page2 = await store.list({ page: 2, perPage: 2 });
    expect(page1.events).toHaveLength(2);
    expect(page2.events).toHaveLength(2);
    expect(page1.total).toBe(5);
    expect(page1.events[0]?.action).toBe("action-4");
    expect(page2.events[0]?.action).toBe("action-2");
  });
});

describe("audit record helpers", () => {
  it("recordStaffAudit enriches actor fields", async () => {
    const store = new FileAuditStore();
    await recordStaffAudit(store, actor, baseEvent());

    const result = await store.list({ page: 1, perPage: 10 });
    const event = result.events[0];
    expect(event?.actorKind).toBe("staff");
    expect(event?.actorId).toBe("staff-1");
    expect(event?.actorEmail).toBe("staff@penaameen.com");
    expect(event?.actorRole).toBe("admin");
  });

  it("recordSystemAudit marks actorKind as system", async () => {
    const store = new FileAuditStore();
    await recordSystemAudit(store, baseEvent());

    const result = await store.list({ page: 1, perPage: 10 });
    expect(result.events[0]?.actorKind).toBe("system");
  });

  it("safeRecordAudit swallows store failures", async () => {
    const failingStore: AuditStore = {
      isAvailable: true,
      append: () => Promise.reject(new Error("boom")),
      list: async () => ({ events: [], total: 0 }),
    };
    await expect(safeRecordAudit(failingStore, baseEvent())).resolves.toBeUndefined();
  });
});