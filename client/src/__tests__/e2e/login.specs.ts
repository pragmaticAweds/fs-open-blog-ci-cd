import { test } from "@playwright/test";

const { describe, beforeEach } = test;

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // ...
  });
});
