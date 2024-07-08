import { render, screen } from "@testing-library/react";

import BlogCard from "@/components/molecules/BlogCard";

test("renders content", ({ expect }) => {
  const blog = {
    _id: "01",
    title: "How to write test",
    author: "Anthony Michelle",
    url: "https://testing.com",
    likes: [],
    User: "000001",
    ref: 1,
  };

  render(<BlogCard blog={blog} />);

  const element = screen.getByText("How to write test");
  expect(element).toBeDefined();
});
