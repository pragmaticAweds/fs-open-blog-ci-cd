import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 80000, // 30 seconds
    hookTimeout: 80000,
  },
});
