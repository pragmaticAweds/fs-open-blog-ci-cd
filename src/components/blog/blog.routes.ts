import { Router } from "express";

import doFetchBlog from "./blog.actions";

const blogsRouter = Router();

blogsRouter.delete("/:blogId", doFetchBlog);

blogsRouter.put("/:blogId", doFetchBlog);

blogsRouter.get("/:blogId", doFetchBlog);

blogsRouter.post("/", doFetchBlog);

blogsRouter.get("/", doFetchBlog);

export default blogsRouter;
