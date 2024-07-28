import { Router } from "express";
import blogsRouter from "./blog/blog.routes";
import commentsRouter from "./comment/comment.routes";
import usersRouter from "./user/user.routes";
import authsRouter from "./auth/auth.routes";
import { appConfig } from "../config";
import { testRouter } from "./test/test.actions";

const componentRouter = Router();

componentRouter.use("/auth", authsRouter);
componentRouter.use("/blogs", blogsRouter);
componentRouter.use("/comments", commentsRouter);
componentRouter.use("/users", usersRouter);

if (appConfig.isE2ETest) {
  componentRouter.use("/testing", testRouter);
}

export default componentRouter;
