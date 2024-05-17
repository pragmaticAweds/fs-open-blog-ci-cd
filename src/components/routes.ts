import { Router } from "express";
import blogRouter from "./blog/blog.routes";

const componentRouter = Router();

componentRouter.use("/blogs", blogRouter);

export default componentRouter;
