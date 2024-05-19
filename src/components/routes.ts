import { Router } from "express";
import blogsRouter from "./blog/blog.routes";
import commentsRouter from "./comment/comment.routes";
import usersRouter from "./user/user.routes";
import authsRouter from "./auth/auth.routes";

const componentRouter = Router();

componentRouter.use("/auths", authsRouter);
componentRouter.use("/blogs", blogsRouter);
componentRouter.use("/blogs/comments", commentsRouter);
componentRouter.use("/users", usersRouter);

export default componentRouter;
