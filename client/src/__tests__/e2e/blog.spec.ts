import { baseUrl } from "@/lib/config/constant";
import { blogData, blogsData, userData } from "../helper";
import { BrowserContext, test } from "@playwright/test";

const { describe, expect, beforeEach, beforeAll } = test;

const [non_creator, creator] = userData;

describe("Blog", () => {
  let context: BrowserContext;

  beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        origin: "http://localhost:5174",
      },
    });

    const req = context.request;

    const page = await context.newPage();

    await req.get(`${baseUrl}/testing/reset`);

    await req.post(`${baseUrl}/auth/signup`, { data: non_creator });

    await req.post(`${baseUrl}/auth/signup`, { data: creator });

    await page.goto("/");
  });

  test.afterAll(async () => {
    await context.close();
  });

  describe("When a creator logs in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(creator.username);
      await page.getByTestId("password").fill(creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByTestId("blog-modal-btn").click();

      await page.getByTestId("author").fill(blogData.author);
      await page.getByTestId("title").fill(blogData.title);
      await page.getByTestId("url").fill(blogData.url);

      await page.getByTestId("add-blog").click();

      await expect(page.getByText("Blog created Successfully.")).toBeVisible();
    });
  });

  describe("When user logs in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(non_creator.username);
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("should forbid non-creator user from adding new blog", async ({
      page,
    }) => {
      await page.getByTestId("blog-modal-btn").click();

      await page.getByTestId("author").fill(blogData.author);
      await page.getByTestId("title").fill(blogData.title);
      await page.getByTestId("url").fill(blogData.url);
      await page.getByTestId("add-blog").click();

      await expect(page.getByText("Forbidden")).toBeVisible();
    });

    test("should show error if an invalid value is supplied", async ({
      page,
    }) => {
      await page.getByTestId("blog-modal-btn").click();

      await page.getByTestId("author").fill(blogData.author);
      await page.getByTestId("title").fill(blogData.title);
      await page.getByTestId("url").fill(blogData.wrongUrl);
      await page.getByTestId("add-blog").click();

      await expect(page.getByText("Invalid input fields.")).toBeVisible();
    });
  });

  describe("When a blog is liked", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(non_creator.username);
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("blog likes should increase when the like button is clicked", async ({
      page,
    }) => {
      const blog = page.locator(`[data-testid="blog"]`, {
        hasText: blogData.title,
      });
      await expect(blog).toBeVisible();

      const likeCount = blog.locator('[data-testid="blog-likes-count"]');
      const likeButton = blog.locator('[data-testid="blog-likes"]');

      const initialLikeCount = await likeCount.innerText();

      await likeButton.click();

      await expect(likeCount).not.toHaveText(initialLikeCount);
    });
  });

  describe("Deleting blog by wrong user", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(non_creator.username);
      await page.getByTestId("password").fill(non_creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("should not show delete button for wrong user", async ({ page }) => {
      const blog = page.locator(`[data-testid="blog"]`, {
        hasText: blogData.title,
      });
      await expect(blog).toBeVisible();

      const deleteBtn = blog.locator('data-testid="blog-delete"');

      await expect(deleteBtn).not.toBeVisible();
    });
  });

  describe("Deleting blog by owner", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(creator.username);
      await page.getByTestId("password").fill(creator.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Login successful")).toBeVisible();
    });

    test("should show delete button for owner", async ({ page }) => {
      const blog = page.locator(`[data-testid="blog"]`, {
        hasText: blogData.title,
      });
      await expect(blog).toBeVisible();

      const deleteBtn = blog.locator('[data-testid="blog-delete"]');

      await expect(deleteBtn).toBeVisible();

      await deleteBtn.click();

      await expect(page.getByText("Blog deleted successfully.")).toBeVisible();
    });
  });

  describe("Sorting blogs by number of likes", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("username").fill(creator.username);
      await page.getByTestId("password").fill(creator.password);
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page.getByText("Login successful")).toBeVisible();

      for (const blogData of blogsData) {
        await page.getByTestId("blog-modal-btn").click();

        await page.getByTestId("author").fill(blogData.author);
        await page.getByTestId("title").fill(blogData.title);
        await page.getByTestId("url").fill(blogData.url);

        await page.getByTestId("add-blog").click();

        await expect(
          page.getByText("Blog created Successfully.")
        ).toBeVisible();
      }

      const blogLocator = page.locator(`[data-testid="blog"]`, {
        hasText: blogsData[0].title,
      });

      const likeButton = blogLocator.locator('[data-testid="blog-likes"]');

      await likeButton.click();
    });

    test("blogs should be arranged in descending order of likes", async ({
      page,
    }) => {
      const blogCards = await page
        .locator('[data-testid="blog"]')
        .elementHandles();

      const blogs = await Promise.all(
        blogCards.map(async (card) => {
          const titleElement = await card.$('[data-testid="blog-title"]');
          const likesElement = await card.$('[data-testid="blog-likes-count"]');

          const title = titleElement ? await titleElement.innerText() : "";
          const likesText = likesElement
            ? await likesElement.innerText()
            : "Likes: 0";
          const likes = parseInt(likesText.replace("Likes: ", ""), 10);

          return { title, likes };
        })
      );

      for (let i = 0; i < blogs.length - 1; i++) {
        expect(blogs[i].likes).toBeGreaterThanOrEqual(blogs[i + 1].likes);
      }
    });
  });
});
