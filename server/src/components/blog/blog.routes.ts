import {
  addBlog,
  disLikeBlog,
  editBlog,
  fetchBlogs,
  fetchSingleBlog,
  likeBlog,
  removeBlog,
} from "./blog.actions";
import { verifyToken } from "../auth/auth.middleware";
import { isCreatorMiddleware, policyMiddleware } from "../../utils";
import {
  blogIdSchema,
  createNewBlogSchema,
  editBlogSchema,
} from "./blog.policy";
import { EnhancedRouter } from "../../utils/routesErrorHandler";

const blogsRouter = new EnhancedRouter();

blogsRouter.patch(
  "/:blogId/like",
  policyMiddleware(blogIdSchema, "params"),
  verifyToken,
  likeBlog
);

blogsRouter.patch(
  "/:blogId/dislike",
  policyMiddleware(blogIdSchema, "params"),
  verifyToken,
  disLikeBlog
);

blogsRouter.delete(
  "/:blogId",
  policyMiddleware(blogIdSchema, "params"),
  verifyToken,
  isCreatorMiddleware,
  removeBlog
);

blogsRouter.get(
  "/:blogId",
  policyMiddleware(blogIdSchema, "params"),
  fetchSingleBlog
);

blogsRouter.patch(
  "/:blogId",
  policyMiddleware(editBlogSchema),
  verifyToken,
  isCreatorMiddleware,
  editBlog
);

blogsRouter.post(
  "/",
  policyMiddleware(createNewBlogSchema),
  verifyToken,
  isCreatorMiddleware,
  addBlog
);

blogsRouter.get("/", fetchBlogs);

export default blogsRouter.getRouter();
