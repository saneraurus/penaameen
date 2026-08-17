import type { CorrelationId } from "@/domain/common/identifiers";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogEntry = {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly operation: string;
  readonly correlationId: CorrelationId;
  readonly message: string;
  readonly context?: Readonly<Record<string, unknown>>;
};

export interface Logger {
  write(entry: LogEntry): void;
}
