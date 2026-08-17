import { createCorrelationId } from "@/domain/common/identifiers";
import { fail, succeed, type Result } from "@/domain/common/result";

export type ApplicationEnvironment = "development" | "test" | "production";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type ServerConfig = {
  readonly environment: ApplicationEnvironment;
  readonly appBaseUrl: URL;
  readonly logLevel: LogLevel;
  readonly foundationMode: true;
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
  const resolved = value ?? "development";

  if (!environments.has(resolved)) {
    throw new Error(`APP_ENV must be one of development, test, production.`);
  }

  return resolved as ApplicationEnvironment;
}

function readLogLevel(value: string | undefined): LogLevel {
  const resolved = value ?? "info";

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
