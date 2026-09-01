import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcDirectory = fileURLToPath(new URL("./src", import.meta.url));
const generatedDirectory = fileURLToPath(
  new URL("./generated", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: {
      "@/generated": generatedDirectory,
      "@": srcDirectory,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/e2e/**"],
    testTimeout: 15000,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
