import { z } from "zod";

export const addNewBlogSchema = z.object({
  title: z.string(),
  author: z.string(),
  url: z.string().trim().url(),
});
