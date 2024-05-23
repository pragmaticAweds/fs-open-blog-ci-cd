import { Router } from "express";
import {
  createBlog,
  editBlog,
  fetchBlogs,
  fetchSingleBlog,
  removeBlog,
} from "./blog.actions";

const blogsRouter = Router();

blogsRouter.delete("/:blogId", removeBlog);

blogsRouter.put("/:blogId", editBlog);

blogsRouter.get("/:blogId", fetchSingleBlog);

blogsRouter.post("/", createBlog);

blogsRouter.get("/", fetchBlogs);

export default blogsRouter;
