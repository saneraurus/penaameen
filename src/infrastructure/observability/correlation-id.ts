import { randomUUID } from "node:crypto";

import {
  createCorrelationId,
  type CorrelationId,
} from "@/domain/common/identifiers";

export function createRequestCorrelationId(
  incomingRequestId?: string | null,
): CorrelationId {
  if (incomingRequestId !== null && incomingRequestId !== undefined) {
    try {
      return createCorrelationId(incomingRequestId);
    } catch {
      return createCorrelationId(randomUUID());
    }
  }

  return createCorrelationId(randomUUID());
}
