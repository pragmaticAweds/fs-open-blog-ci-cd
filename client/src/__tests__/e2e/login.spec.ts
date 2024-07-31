import { baseUrl } from "@/lib/config/constant";
import { BrowserContext, test } from "@playwright/test";
import { userData } from "../helper";

const { describe, beforeAll, expect } = test;

const [non_creator, creator] = userData;

describe("Blog app", () => {
  let context: BrowserContext;
  beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        origin: "http://localhost:5174",
      },
    });

    const req = context.request;

    await req.get(`${baseUrl}/testing/reset`);

    await req.post(`${baseUrl}/auth/signup`, { data: non_creator });

    await req.post(`${baseUrl}/auth/signup`, { data: creator });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Login" }).click();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      page.goto("/");
      await page.getByTestId("username").fill(non_creator.username);
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      page.goto("/");
      await page.getByTestId("username").fill("John Doe");
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("invalid credentials")).toBeVisible();
    });
  });
});
