import AddBlogForm from "@/components/molecules/AddBlogForm";
import { addNewBlog } from "@/lib/actions/blog";
import { expect, test, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocking addNewBlog
vi.mock("@/lib/actions/blog", () => ({
  addNewBlog: vi.fn(),
}));

const formData = {
  author: "Aweds",
  title: "How to add a form",
  url: "https://formatid.com",
};

test("Add blog form updates parent state and calls onSubmit", async () => {
  const closeModalMockHandler = vi.fn();

  render(<AddBlogForm closeModal={closeModalMockHandler} />);

  (addNewBlog as Mock).mockResolvedValue({
    data: formData,
    status: true,
    message: "Blog added successfully",
  });

  const user = userEvent.setup();

  const authorInput = screen.getByRole("textbox", { name: /author/i });
  await user.type(authorInput, formData.author);

  const titleInput = screen.getByRole("textbox", { name: /title/i });
  await user.type(titleInput, formData.title);

  const urlInput = screen.getByRole("textbox", { name: /url/i });
  await user.type(urlInput, formData.url);

  const button = screen.getByRole("button", { name: /add blog/i });
  await user.click(button);

  await waitFor(() => {
    expect(addNewBlog).toHaveBeenCalledWith({
      author: formData.author,
      title: formData.title,
      url: formData.url,
    });
    expect(closeModalMockHandler).toHaveBeenCalled();
  });
});
