import { Router } from "express";

import doFetchBlog from "./blog.actions";

const blogRouter = Router();

blogRouter.get("/", doFetchBlog);

export default blogRouter;
