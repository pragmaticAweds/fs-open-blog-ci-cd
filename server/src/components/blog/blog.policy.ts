import { z } from "zod";

const createNewBlogSchema = z.object({
  title: z.string(),
  author: z.string(),
  url: z.string().trim().url(),
});

const blogIdSchema = z.object({
  blogId: z.string().trim(),
});

const editBlogSchema = createNewBlogSchema.optional();

export { createNewBlogSchema, blogIdSchema, editBlogSchema };
