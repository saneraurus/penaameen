import type { CorrelationId } from "@/domain/common/identifiers";

export type ApplicationErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_REQUIRED"
  | "AUTHORIZATION_DENIED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BUSINESS_RULE_VIOLATION"
  | "DEPENDENCY_UNAVAILABLE"
  | "PROVIDER_ERROR"
  | "INFRASTRUCTURE_ERROR"
  | "UNEXPECTED_ERROR";

export type ApplicationError = {
  readonly code: ApplicationErrorCode;
  readonly message: string;
  readonly correlationId: CorrelationId;
  readonly safeDetails?: Readonly<Record<string, string>>;
  readonly cause?: unknown;
};

export function createApplicationError(
  error: ApplicationError,
): ApplicationError {
  return error;
}

export function toHttpStatus(error: ApplicationError): number {
  switch (error.code) {
    case "VALIDATION_ERROR":
    case "BUSINESS_RULE_VIOLATION":
      return 422;
    case "AUTHENTICATION_REQUIRED":
      return 401;
    case "AUTHORIZATION_DENIED":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "DEPENDENCY_UNAVAILABLE":
    case "PROVIDER_ERROR":
      return 503;
    case "INFRASTRUCTURE_ERROR":
    case "UNEXPECTED_ERROR":
      return 500;
  }
}

export function toPublicErrorResponse(error: ApplicationError): {
  readonly error: {
    readonly code: ApplicationErrorCode;
    readonly message: string;
    readonly requestId: CorrelationId;
    readonly fields?: Readonly<Record<string, string>>;
  };
} {
  return {
    error: {
      code: error.code,
      message: error.message,
      requestId: error.correlationId,
      ...(error.safeDetails === undefined ? {} : { fields: error.safeDetails }),
    },
  };
}
