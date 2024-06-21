import { z } from "zod";

const commentSchema = z.object({
  commentId: z.string().trim(),
  blogId: z.string().trim(),
});

const commentIdSchema = commentSchema.pick({ commentId: true });

const addCommentSchema = z.object({
  blogId: z.string().trim(),
  text: z.string().trim(),
});

const editCommentSchema = z.object({
  text: z.string().trim().optional(),
});

export { commentSchema, commentIdSchema, addCommentSchema, editCommentSchema };
