import type { CorrelationId, ResourceId } from "@/domain/common/identifiers";

export type JobContext = {
  readonly jobId: ResourceId;
  readonly correlationId: CorrelationId;
  readonly attempt: number;
  readonly operation: string;
};

export type JobResult =
  | { readonly status: "succeeded" }
  | {
      readonly status: "retry_required";
      readonly reason: string;
    }
  | {
      readonly status: "manual_review_required";
      readonly reason: string;
    };
