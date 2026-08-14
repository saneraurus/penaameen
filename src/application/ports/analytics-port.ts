import type { CorrelationId } from "@/domain/common/identifiers";

export type AnalyticsEventIntent = {
  readonly name: string;
  readonly correlationId: CorrelationId;
  readonly occurredAt: Date;
  readonly context: Readonly<Record<string, string | number | boolean>>;
};

export interface AnalyticsPort {
  capture(intent: AnalyticsEventIntent): Promise<void>;
}
