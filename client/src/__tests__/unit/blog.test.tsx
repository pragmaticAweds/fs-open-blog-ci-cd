import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogCard from "@/components/molecules/BlogCard";

const blog = {
  _id: "01",
  title: "How to write test",
  author: "Anthony Michelle",
  url: "https://testing.com",
  likes: [],
  User: "000001",
  ref: 1,
};

test("renders content", ({ expect }) => {
  render(<BlogCard blog={blog} />);

  const element = screen.getByTestId("blog");

  expect(element).toBeDefined();
});

test("likes and url is shown by default", ({ expect }) => {
  render(<BlogCard blog={blog} />);

  const element = screen.getByTestId("blog-likes");

  expect(element).toBeDefined();
});

test("likes and url are shown when the view btn is clicked", async ({
  expect,
}) => {
  render(<BlogCard blog={blog} />);

  const user = userEvent.setup();

  const button = screen.getByText("View");

  await user.click(button);

  const urlElement = screen.getByText(blog.url);

  const likesElement = screen.getByText(`Likes: ${blog.likes.length}`);

  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
});

test("event handler is called twice when btn is clicked twice", async ({
  expect,
}) => {
  render(<BlogCard blog={blog} />);

  const user = userEvent.setup();

  const button = screen.getByText("View");

  await user.click(button);

  const likeBtn = screen.getByTestId("blog-likes");

  const mockHandler = vi.fn();

  likeBtn.addEventListener("click", mockHandler);

  await user.dblClick(likeBtn);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
