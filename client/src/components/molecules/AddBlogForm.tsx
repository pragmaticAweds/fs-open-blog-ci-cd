import { FormEvent } from "react";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNewBlog } from "@/lib/actions/blog";
import { addBlog } from "@/entities/blog-entity";

const AddBlogForm = ({ closeModal }: { closeModal: () => void }) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { currentTarget } = e;

    const formData = new FormData(currentTarget);

    const fieldNames = ["author", "title", "url"];

    const [author, title, url] = fieldNames.map(
      (field) => formData.get(field) as string
    );

    try {
      const { data, status, message } = await addNewBlog({
        author,
        title,
        url,
      });

      if (status) {
        toast(message, { type: "success" });

        addBlog(data);

        // Reset form fields
        fieldNames.forEach((field) => {
          const input = currentTarget.elements.namedItem(
            field
          ) as HTMLInputElement;
          if (input) input.value = "";
        });

        closeModal();

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form
        className="flex flex-col w-full gap-y-12 bg-white p-8"
        onSubmit={handleSubmit}
        data-testid="blog-form"
      >
        <h1 className="text-2xl text-center font-medium">Add New Blog</h1>
        <Input label="Author" isRequired name="author" data-testid="author" />
        <Input label="Title" isRequired name="title" data-testid="title" />
        <Input label="Url" isRequired name="url" data-testid="url" />

        <Button label="Add Blog" data-testid="add-blog" />
      </form>
    </>
  );
};

export default AddBlogForm;
