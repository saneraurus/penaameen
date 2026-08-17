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

vi.mock("@/lib/prisma", () => ({
  prisma: {
    systemControl: {
      findMany: () => Promise.reject(new Error("db unavailable")),
      upsert: () => Promise.reject(new Error("db unavailable")),
    },
  },
}));

import {
  SYSTEM_CONTROL_KEYS,
  getSystemControls,
  setSystemControl,
  isSystemControlEnabled,
} from "@/lib/admin/system-controls";

describe("emergency system controls (file fallback)", () => {
  beforeEach(() => {
    fsMock.mem.clear();
  });

  it("returns all known controls, defaulting to disabled", async () => {
    const controls = await getSystemControls();
    expect(controls).toHaveLength(SYSTEM_CONTROL_KEYS.length);
    for (const control of controls) {
      expect(control.value).toBe(false);
      expect(control.label).toBeTruthy();
    }
  });

  it("sets a control and persists it", async () => {
    await setSystemControl("disable_payment_webhook_processing", true, "staff-1");

    expect(await isSystemControlEnabled("disable_payment_webhook_processing")).toBe(
      true,
    );
    const controls = await getSystemControls();
    const control = controls.find(
      (c) => c.key === "disable_payment_webhook_processing",
    );
    expect(control?.value).toBe(true);
    expect(control?.updatedById).toBe("staff-1");
  });

  it("flips a control back to disabled", async () => {
    await setSystemControl("pause_automations", true, "staff-1");
    await setSystemControl("pause_automations", false, "staff-1");

    expect(await isSystemControlEnabled("pause_automations")).toBe(false);
  });
});