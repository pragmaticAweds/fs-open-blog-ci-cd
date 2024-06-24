import { z } from "zod";

const commentIdSchema = z.object({ commentId: z.string().trim() });

const addCommentSchema = z.object({
  blogId: z.string().trim(),
  text: z.string().trim(),
});

const editCommentSchema = z.object({
  text: z.string().trim().optional(),
});

export { commentIdSchema, addCommentSchema, editCommentSchema };
