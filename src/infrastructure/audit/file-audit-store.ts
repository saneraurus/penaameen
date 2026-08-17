import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import type {
  AuditEventInput,
  AuditRecord,
} from "@/domain/audit/audit-event";
import type {
  AuditListOptions,
  AuditListResult,
  AuditStore,
} from "@/application/audit/audit-store";

const AUDIT_FILE = path.join(process.cwd(), "src/data/audit_log.jsonl");

export class FileAuditStore implements AuditStore {
  readonly isAvailable = true;

  async append(event: AuditEventInput): Promise<void> {
    const dir = path.dirname(AUDIT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const record: AuditRecord = {
      ...event,
      id: randomUUID(),
      occurredAt: event.occurredAt ?? new Date(),
    };

    // Append-only: each event is one JSON line. Existing content is never
    // rewritten, preserving an append-only audit trail from the application.
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(record) + "\n", "utf-8");
  }

  async list(options: AuditListOptions): Promise<AuditListResult> {
    const { page, perPage, action, targetType, actorId, outcome, from, to } =
      options;

    let records: AuditRecord[] = [];
    try {
      if (fs.existsSync(AUDIT_FILE)) {
        const raw = fs.readFileSync(AUDIT_FILE, "utf-8");
        records = raw
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            try {
              return JSON.parse(line) as AuditRecord;
            } catch {
              return null;
            }
          })
          .filter((r): r is AuditRecord => r !== null);
      }
    } catch (e) {
      console.warn("Could not read audit log:", e);
    }

    let filtered = records;
    if (action) filtered = filtered.filter((r) => r.action === action);
    if (targetType)
      filtered = filtered.filter((r) => r.targetType === targetType);
    if (actorId) filtered = filtered.filter((r) => r.actorId === actorId);
    if (outcome) filtered = filtered.filter((r) => r.outcome === outcome);
    if (from) {
      const fromTime = new Date(from).getTime();
      filtered = filtered.filter((r) => r.occurredAt.getTime() >= fromTime);
    }
    if (to) {
      const toTime = new Date(to).getTime();
      filtered = filtered.filter((r) => r.occurredAt.getTime() <= toTime);
    }

    filtered.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const events = filtered.slice(start, start + perPage);

    return { events, total };
  }
}