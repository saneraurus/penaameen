import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const SYSTEM_CONTROL_KEYS = [
  "pause_automations",
  "disable_whatsapp_auto_send",
  "disable_payment_webhook_processing",
  "disable_outbound_email",
] as const;

export type SystemControlKey = (typeof SYSTEM_CONTROL_KEYS)[number];

export const SYSTEM_CONTROL_LABELS: Record<SystemControlKey, string> = {
  pause_automations: "Pause All Automations",
  disable_whatsapp_auto_send: "Disable WhatsApp Auto-Send",
  disable_payment_webhook_processing: "Disable Payment Webhook Processing",
  disable_outbound_email: "Disable Outbound Email",
};

export interface SystemControlState {
  key: SystemControlKey;
  label: string;
  value: boolean;
  updatedById: string | null;
  updatedAt: string | null;
}

const CONTROLS_FILE = path.join(process.cwd(), "src/data/system_controls.json");

type StoredControl =
  | boolean
  | { value: boolean; updatedById?: string | null; updatedAt?: string | null };

function loadFileControls(): Partial<Record<SystemControlKey, StoredControl>> {
  try {
    if (fs.existsSync(CONTROLS_FILE)) {
      const raw = fs.readFileSync(CONTROLS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as Partial<Record<SystemControlKey, StoredControl>>;
      }
    }
  } catch (e) {
    console.warn("Could not read system_controls.json:", e);
  }
  return {};
}

function saveFileControls(
  values: Partial<Record<SystemControlKey, StoredControl>>,
): void {
  try {
    const dir = path.dirname(CONTROLS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTROLS_FILE, JSON.stringify(values, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write system_controls.json:", e);
  }
}

let prismaUnavailable = false;

export async function getSystemControls(): Promise<SystemControlState[]> {
  let rows: Array<{
    key: string;
    value: boolean;
    updatedById: string | null;
    updatedAt: Date;
  }> = [];

  if (!prismaUnavailable) {
    try {
      rows = await prisma.systemControl.findMany();
    } catch {
      prismaUnavailable = true;
    }
  }

  const fileValues = loadFileControls();

  return SYSTEM_CONTROL_KEYS.map((key) => {
    const row = rows.find((r) => r.key === key);
    const stored = fileValues[key];
    const storedValue =
      typeof stored === "object" && stored !== null
        ? stored.value
        : (stored as boolean | undefined);
    const value = row !== undefined ? row.value : (storedValue ?? false);
    return {
      key,
      label: SYSTEM_CONTROL_LABELS[key],
      value,
      updatedById:
        row?.updatedById ??
        (typeof stored === "object" && stored !== null
          ? (stored.updatedById ?? null)
          : null),
      updatedAt: row?.updatedAt
        ? row.updatedAt.toISOString()
        : typeof stored === "object" && stored !== null
          ? (stored.updatedAt ?? null)
          : null,
    };
  });
}

export async function setSystemControl(
  key: SystemControlKey,
  value: boolean,
  updatedById: string,
): Promise<SystemControlState> {
  if (!prismaUnavailable) {
    try {
      const db = await prisma.systemControl.upsert({
        where: { key },
        update: { value, updatedById },
        create: { key, value, label: SYSTEM_CONTROL_LABELS[key], updatedById },
      });
      return {
        key: db.key as SystemControlKey,
        label: SYSTEM_CONTROL_LABELS[key as SystemControlKey],
        value: db.value,
        updatedById: db.updatedById,
        updatedAt: db.updatedAt ? db.updatedAt.toISOString() : null,
      };
    } catch {
      prismaUnavailable = true;
    }
  }

  const values = loadFileControls();
  values[key] = { value, updatedById, updatedAt: new Date().toISOString() };
  saveFileControls(values);
  return {
    key,
    label: SYSTEM_CONTROL_LABELS[key],
    value,
    updatedById,
    updatedAt: new Date().toISOString(),
  };
}

export async function isSystemControlEnabled(
  key: SystemControlKey,
): Promise<boolean> {
  const controls = await getSystemControls();
  return controls.find((c) => c.key === key)?.value ?? false;
}
