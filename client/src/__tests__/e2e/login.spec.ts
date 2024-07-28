import { baseUrl } from "@/lib/config/constant";
import { test } from "@playwright/test";
import { apiContext, userData } from "../helper";

const { describe, beforeEach, expect } = test;

const [non_creator, creator] = userData;

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await apiContext.get(`${baseUrl}/testing/reset`);

    await apiContext.post(`${baseUrl}/auth/signup`, { data: non_creator });

    await apiContext.post(`${baseUrl}/auth/signup`, { data: creator });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Login" }).click();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill(non_creator.username);
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("John Doe");
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("invalid credentials")).toBeVisible();
    });
  });
});
