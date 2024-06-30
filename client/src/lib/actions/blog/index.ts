import { fetchFromApi } from "@/services";
import { addNewBlogSchema } from "./policy";
import { z } from "zod";

export const addNewBlog = async (data: z.infer<typeof addNewBlogSchema>) => {
  const validatedFields = addNewBlogSchema.safeParse(data);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input fields.",
    };

  try {
    const { status, message, data } = await fetchFromApi({
      url: "blogs",
      method: "post",
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
