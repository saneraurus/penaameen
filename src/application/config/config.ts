import { createCorrelationId } from "@/domain/common/identifiers";
import { fail, succeed, type Result } from "@/domain/common/result";
import { getApiSettings } from "@/lib/admin/api-settings";

export type ApplicationEnvironment = "development" | "test" | "production";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type ServerConfig = {
  readonly environment: ApplicationEnvironment;
  readonly appBaseUrl: URL;
  readonly logLevel: LogLevel;
  readonly foundationMode: true;
};

export type ReadinessState = "ready" | "blocked" | "unknown";

export type EnvironmentReadinessCheck = {
  readonly id: string;
  readonly state: ReadinessState;
  readonly required: boolean;
  readonly detail: string;
};

export type EnvironmentReadiness = {
  readonly state: ReadinessState;
  readonly environment: ApplicationEnvironment;
  readonly checks: readonly EnvironmentReadinessCheck[];
};

export type ConfigurationError = {
  readonly code: "CONFIGURATION_ERROR";
  readonly message: string;
  readonly correlationId: ReturnType<typeof createCorrelationId>;
};

const environments: ReadonlySet<string> = new Set([
  "development",
  "test",
  "production",
]);
const logLevels: ReadonlySet<string> = new Set([
  "debug",
  "info",
  "warn",
  "error",
]);

function configurationError(message: string): ConfigurationError {
  return {
    code: "CONFIGURATION_ERROR",
    message,
    correlationId: createCorrelationId("configuration"),
  };
}

function readEnvironment(value: string | undefined): ApplicationEnvironment {
  const resolved = (value ?? "development").toLowerCase();

  if (!environments.has(resolved)) {
    throw new Error(`APP_ENV must be one of development, test, production.`);
  }

  return resolved as ApplicationEnvironment;
}

function readLogLevel(value: string | undefined): LogLevel {
  const resolved = (value ?? "info").toLowerCase();

  if (!logLevels.has(resolved)) {
    throw new Error(`LOG_LEVEL must be one of debug, info, warn, error.`);
  }

  return resolved as LogLevel;
}

export function loadServerConfig(
  environmentValues: Readonly<Record<string, string | undefined>>,
): Result<ServerConfig, ConfigurationError> {
  try {
    const environment = readEnvironment(environmentValues.APP_ENV);
    const configuredBaseUrl = environmentValues.APP_BASE_URL;

    if (environment === "production" && configuredBaseUrl === undefined) {
      return fail(
        configurationError(
          "APP_BASE_URL is required when APP_ENV is production.",
        ),
      );
    }

    const appBaseUrl = new URL(configuredBaseUrl ?? "http://localhost:3000");

    return succeed({
      environment,
      appBaseUrl,
      logLevel: readLogLevel(environmentValues.LOG_LEVEL),
      foundationMode: true,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Configuration validation failed unexpectedly.";

    return fail(configurationError(message));
  }
}

export function getServerConfig(): ServerConfig {
  const result = loadServerConfig(process.env);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

export function getPublicRuntimeConfig(config: ServerConfig): {
  readonly environment: ApplicationEnvironment;
  readonly foundationMode: true;
} {
  return {
    environment: config.environment,
    foundationMode: config.foundationMode,
  };
}

function hasValue(
  values: Readonly<Record<string, string | undefined>>,
  key: string,
) {
  const value = values[key]?.trim();
  if (!value) return false;
  return !/^(?:\.\.\.|.*REDACTED.*|.*your_.*|.*placeholder.*)$/i.test(value);
}

function readinessCheck(
  id: string,
  values: Readonly<Record<string, string | undefined>>,
  keys: readonly string[],
  required: boolean,
  detail: string,
): EnvironmentReadinessCheck {
  const configured = keys.every((key) => hasValue(values, key));
  return {
    id,
    state: configured ? "ready" : required ? "blocked" : "unknown",
    required,
    detail: configured ? "configured" : detail,
  };
}

/** Checks configuration presence without returning secret values. */
export function getEnvironmentReadiness(
  values: Readonly<Record<string, string | undefined>>,
): EnvironmentReadiness {
  const environment = readEnvironment(values.APP_ENV);
  const production = environment === "production";
  let effective = values;
  try {
    const settings = getApiSettings();
    effective = {
      ...values,
      CASAKU_LICENSE_KEY: settings.casaku.licenseKey,
      CASAKU_WEBHOOK_SECRET: settings.casaku.webhookSecret,
      CASAKU_QR_ID: settings.casaku.qrId,
      MIDTRANS_SERVER_KEY: settings.midtrans.serverKey,
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: settings.midtrans.clientKey,
      RAJAONGKIR_API_KEY: settings.rajaongkir.apiKey,
      RESEND_API_KEY: settings.autoEmail.apiKey,
      CLERK_PUBLISHABLE_KEY: settings.clerkAuth.publishableKey,
      CLERK_SECRET_KEY: settings.clerkAuth.secretKey,
    };
  } catch {
    // Keep raw environment values if the optional settings file is unavailable.
  }
  const checks = [
    readinessCheck(
      "app.base_url",
      effective,
      ["APP_BASE_URL"],
      production,
      "APP_BASE_URL is not configured",
    ),
    readinessCheck(
      "database.url",
      effective,
      ["DATABASE_URL"],
      production,
      "DATABASE_URL is not configured",
    ),
    readinessCheck(
      "auth.clerk",
      effective,
      ["CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
      production,
      "Clerk credentials are not configured",
    ),
    readinessCheck(
      "payment.casaku",
      effective,
      ["CASAKU_LICENSE_KEY", "CASAKU_WEBHOOK_SECRET", "CASAKU_QR_ID"],
      false,
      "Casaku credentials are not configured",
    ),
    readinessCheck(
      "payment.midtrans",
      effective,
      ["MIDTRANS_SERVER_KEY", "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY"],
      false,
      "Midtrans credentials are not configured",
    ),
    readinessCheck(
      "shipping.rajaongkir",
      effective,
      ["RAJAONGKIR_API_KEY"],
      false,
      "RajaOngkir credentials are not configured",
    ),
    readinessCheck(
      "email.resend",
      effective,
      ["RESEND_API_KEY"],
      false,
      "Resend credentials are not configured",
    ),
    {
      id: "catalog.google_sheets",
      state:
        hasValue(effective, "GOOGLE_SHEETS_SPREADSHEET_ID") &&
        (hasValue(effective, "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON") ||
          hasValue(effective, "GOOGLE_SHEETS_SERVICE_ACCOUNT_FILE"))
          ? "ready"
          : "unknown",
      required: false,
      detail:
        hasValue(effective, "GOOGLE_SHEETS_SPREADSHEET_ID") &&
        (hasValue(effective, "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON") ||
          hasValue(effective, "GOOGLE_SHEETS_SERVICE_ACCOUNT_FILE"))
          ? "configured"
          : "Google Sheets spreadsheet and service-account access are not configured",
    } satisfies EnvironmentReadinessCheck,
  ] as const;
  const state: ReadinessState = checks.some((item) => item.state === "blocked")
    ? "blocked"
    : checks.some((item) => item.state === "unknown")
      ? "unknown"
      : "ready";

  return { state, environment, checks };
}
