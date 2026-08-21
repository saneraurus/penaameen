import {
  getEnvironmentReadiness,
  type ServerConfig,
} from "@/application/config/config";

export type FoundationHealth = {
  readonly status: "ok";
  readonly foundationMode: true;
  readonly environment: ServerConfig["environment"];
  readonly readiness: ReturnType<typeof getEnvironmentReadiness>;
};

export function getFoundationHealth(config: ServerConfig): FoundationHealth {
  return {
    status: "ok",
    foundationMode: config.foundationMode,
    environment: config.environment,
    readiness: getEnvironmentReadiness({
      ...process.env,
      APP_ENV: config.environment,
      APP_BASE_URL: config.appBaseUrl.toString(),
    }),
  };
}
