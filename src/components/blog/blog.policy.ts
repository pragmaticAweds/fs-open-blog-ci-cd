import { z } from "zod";

const createNewBlogSchema = z.object({
  title: z.string(),
  author: z.string(),
  url: z.string().trim().url(),
});

const blogIdSchema = z.object({
  blogId: z.string().trim(),
});

const editBlogSchema = blogIdSchema.extend({
  title: z.string().optional(),
  author: z.string().optional(),
  url: z.string().trim().url().optional(),
});

export { createNewBlogSchema, blogIdSchema, editBlogSchema };
