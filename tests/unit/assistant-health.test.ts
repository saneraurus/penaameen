import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAssistantHealth,
  isUsableAssistantKey,
} from "@/lib/assistant/assistant-health";

describe("assistant provider health", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("rejects missing and placeholder keys", () => {
    expect(isUsableAssistantKey(undefined)).toBe(false);
    expect(isUsableAssistantKey("REDACTED")).toBe(false);
    expect(isUsableAssistantKey("your_provider_key")).toBe(false);
  });
  it("reports provider state without exposing keys", () => {
    vi.stubEnv("GROQ_API_KEY", "test-key");
    const health = getAssistantHealth();
    expect(health.state).toBe("configured");
    expect(JSON.stringify(health)).not.toContain("test-key");
  });
});
