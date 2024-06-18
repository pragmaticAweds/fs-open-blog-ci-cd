import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 80000, // 30 seconds
    hookTimeout: 80000,
    poolOptions: {
      forks: {
        // singleFork: true,
        maxForks: 2,
      },
    },
    sequence: {
      // Options to control the sequence of test files
      concurrent: false, // Ensure tests run sequentially
      shuffle: false, // Disable shuffling of test files
    },
  },
});
