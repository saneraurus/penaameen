import type { Result } from "@/domain/common/result";
import type { CorrelationId, ResourceId } from "@/domain/common/identifiers";

export type NotificationIntent = {
  readonly notificationId: ResourceId;
  readonly eventType: string;
  readonly correlationId: CorrelationId;
};

export type NotificationPortError = {
  readonly category: "temporary" | "permanent" | "consent_required";
  readonly message: string;
};

export interface NotificationPort {
  deliver(
    intent: NotificationIntent,
  ): Promise<
    Result<{ readonly deliveryReference: string }, NotificationPortError>
  >;
}
