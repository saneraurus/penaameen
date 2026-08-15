import type { ServerConfig } from "@/application/config/config";

export type FoundationHealth = {
  readonly status: "ok";
  readonly foundationMode: true;
  readonly environment: ServerConfig["environment"];
};

export function getFoundationHealth(config: ServerConfig): FoundationHealth {
  return {
    status: "ok",
    foundationMode: config.foundationMode,
    environment: config.environment,
  };
}
