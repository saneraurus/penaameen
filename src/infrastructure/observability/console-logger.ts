import { redactLogContext } from "@/application/observability/redaction";
import type { Logger, LogEntry } from "@/application/observability/logger";

export class ConsoleLogger implements Logger {
  write(entry: LogEntry): void {
    const safeEntry = {
      ...entry,
      ...(entry.context === undefined
        ? {}
        : { context: redactLogContext(entry.context) }),
    };

    console.log(JSON.stringify(safeEntry));
  }
}
