import { FormEvent } from "react";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNewBlog } from "@/lib/actions/blog";
import { addBlog } from "@/entities/blog-entity";

const AddBlogForm = () => {
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

        fieldNames.forEach((field) => (currentTarget[field]["value"] = ""));

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={700} />

      <form className="flex flex-col w-full gap-y-12" onSubmit={handleSubmit}>
        <Input label="Author" isRequired name="author" />
        <Input label="Title" isRequired name="title" />
        <Input label="Url" isRequired name="url" />

        <Button label="Add Blog" />
      </form>
    </>
  );
};

export default AddBlogForm;
