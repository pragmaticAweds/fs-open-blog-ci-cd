import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    hookTimeout: 60000, // 30 seconds
  },
});
