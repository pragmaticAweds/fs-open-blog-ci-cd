import { Router } from "express";
import { policyMiddleware } from "../../utils";
import { blogIdSchema } from "../blog/blog.policy";
import { verifyToken } from "../auth/auth.middleware";

import {
  commentSchema,
  addCommentSchema,
  editCommentSchema,
} from "./comment.policy";

import {
  addComment,
  deleteComment,
  editComment,
  getComments,
  getSingleComment,
} from "./comment.actions";

const commentsRouter = Router();

commentsRouter.get(
  "/:commentId/blogs/:blogId",
  policyMiddleware(commentSchema, "params"),
  verifyToken,
  getSingleComment
);

commentsRouter.delete(
  "/:commentId/blogs/:blogId",
  policyMiddleware(commentSchema, "params"),
  verifyToken,
  deleteComment
);

commentsRouter.get(
  "/blogs/:blogId",
  policyMiddleware(blogIdSchema, "params"),
  verifyToken,
  getComments
);

commentsRouter.put(
  "/",
  policyMiddleware(editCommentSchema),
  verifyToken,
  editComment
);

commentsRouter.post(
  "/",
  policyMiddleware(addCommentSchema),
  verifyToken,
  addComment
);

export default commentsRouter;
