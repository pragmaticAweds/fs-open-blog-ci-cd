import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../types";
import BlogModel from "./blog.model";
import { handleResponse, hasPermission } from "../../utils";
import { createNewBlogSchema } from "./blog.policy";

const addBlog = async (req: IRequest, res: Response) => {
  const { author, title, url }: z.infer<typeof createNewBlogSchema> = req.body;

  const newBlog = await new BlogModel({
    author,
    title,
    url,
    User: req.decoded?.ref,
  }).save();

  return handleResponse(
    res,
    {
      message: "Blog created Successfully.",
      data: newBlog,
    },
    201
  );
};

const fetchBlogs = async (_req: IRequest, res: Response) => {
  const allBlogs = await BlogModel.find({}).lean();

  return handleResponse(res, {
    data: allBlogs,
  });
};

const fetchSingleBlog = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  const blogExist = await BlogModel.findById(blogId);

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  return handleResponse(res, { data: blogExist });
};

const editBlog = async (req: IRequest, res: Response) => {
  const { body, params } = req;

  const { title, author, url }: z.infer<typeof createNewBlogSchema> = body;

  const blogExist = await BlogModel.findById(params.blogId);

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  if (!hasPermission(blogExist.User, req)) {
    return handleResponse(res, "Forbidden", 403);
  }

  if (title) blogExist.title = title;

  if (author) blogExist.author = author;

  if (url) blogExist.url = url;

  await blogExist.save();

  return handleResponse(res, {
    message: "Blog updated Successfully.",
    data: blogExist,
  });
};

const likeBlog = async (req: IRequest, res: Response) => {
  const { params, decoded } = req;

  const { blogId } = params;

  const blogExist = await BlogModel.findById(blogId);

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  const hasLikedBlog = blogExist.likes.find((user) => user === decoded?.ref);

  if (!hasLikedBlog) {
    blogExist.likes = blogExist.likes.concat(decoded?.ref as string);

    await blogExist.save();
  }

  return handleResponse(res, {
    message: "Blog liked Successfully.",
    data: blogExist,
  });
};

const disLikeBlog = async (req: IRequest, res: Response) => {
  const { params, decoded } = req;

  const { blogId } = params;

  const blogExist = await BlogModel.findById(blogId);

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  blogExist.likes = blogExist.likes.filter(
    (user) => user !== (decoded?.ref as string)
  );

  if (blogExist.isModified("likes")) await blogExist.save();

  return handleResponse(res, {
    message: "Blog disliked Successfully.",
    data: blogExist,
  });
};

const removeBlog = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  const blogExist = await BlogModel.findById(blogId);

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  if (!hasPermission(blogExist.User, req)) {
    return handleResponse(res, "Forbidden", 403);
  }

  await BlogModel.deleteOne({ _id: blogId });

  return handleResponse(res, "Blog deleted successfully.", 200);
};

export {
  addBlog,
  fetchBlogs,
  fetchSingleBlog,
  removeBlog,
  editBlog,
  likeBlog,
  disLikeBlog,
};
