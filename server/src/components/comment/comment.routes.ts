import { Router } from "express";
import { policyMiddleware } from "../../utils";
import { blogIdSchema } from "../blog/blog.policy";
import { verifyToken } from "../auth/auth.middleware";

import {
  addCommentSchema,
  editCommentSchema,
  commentIdSchema,
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
  "/blogs/:blogId",
  policyMiddleware(blogIdSchema, "params"),
  getComments
);

commentsRouter.get(
  "/:commentId",
  policyMiddleware(commentIdSchema, "params"),
  getSingleComment
);

commentsRouter.delete(
  "/:commentId",
  policyMiddleware(commentIdSchema, "params"),
  verifyToken,
  deleteComment
);

commentsRouter.patch(
  "/:commentId",
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
