import { fetchFromApi } from "@/services";
import { addNewBlogSchema } from "./policy";
import { z } from "zod";

const addNewBlog = async (data: z.infer<typeof addNewBlogSchema>) => {
  const validatedFields = addNewBlogSchema.safeParse(data);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input fields.",
    };

  try {
    const { status, message, data } = await fetchFromApi({
      url: "blogs",
      method: "POST",
      data: validatedFields.data,
    });

    if (!status) return { message, status };

    return {
      data,
      message,
      status,
    };
  } catch (err) {
    return {
      status: false,
      message: (err as { message: string }).message,
    };
  }
};

const likeBlog = async (blogId: string) => {
  if (!blogId)
    return {
      message: "blog Id required",
    };

  try {
    const { status, message, data } = await fetchFromApi({
      url: `blogs/${blogId}/like`,
      method: "PATCH",
    });

    if (!status) return { message, status };

    return {
      data,
      message,
      status,
    };
  } catch (err) {
    return {
      status: false,
      message: (err as { message: string }).message,
    };
  }
};

const deleteBlog = async (blogId: string) => {
  if (!blogId)
    return {
      message: "blog Id required",
    };

  try {
    const { status, message, data } = await fetchFromApi({
      url: `blogs/${blogId}`,
      method: "DELETE",
    });

    if (!status) return { message, status };

    return {
      data,
      message,
      status,
    };
  } catch (err) {
    return {
      status: false,
      message: (err as { message: string }).message,
    };
  }
};

export { addNewBlog, likeBlog, deleteBlog };
