import { Response } from "express";
import { z } from "zod";

import { handleErrorResponse } from "../../utils/errorHandler";
import { IRequest } from "../../types";
import BlogModel from "./blog.model";
import { handleResponse, hasPermission } from "../../utils";
import { createNewBlogSchema } from "./blog.policy";

const addBlog = async (req: IRequest, res: Response) => {
  const { author, title, url }: z.infer<typeof createNewBlogSchema> = req.body;

  try {
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
  } catch (err) {
    handleErrorResponse(err);
  }
};

const fetchBlogs = async (_req: IRequest, res: Response) => {
  try {
    const allBlogs = await BlogModel.find({}).lean();

    return handleResponse(res, {
      data: allBlogs,
    });
  } catch (err) {
    handleErrorResponse(err);
  }
};

const fetchSingleBlog = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  try {
    const blogExist = await BlogModel.findById(blogId);

    if (!blogExist) return handleResponse(res, "blog does not exists", 404);

    return handleResponse(res, { data: blogExist });
  } catch (err) {
    handleErrorResponse(err);
  }
};

const editBlog = async (req: IRequest, res: Response) => {
  const { body, params } = req;

  const { title, author, url }: z.infer<typeof createNewBlogSchema> = body;

  try {
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
  } catch (err) {
    handleErrorResponse(err);
  }
};

const likeBlog = async (req: IRequest, res: Response) => {
  const { params, decoded } = req;

  const { blogId } = params;

  try {
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
  } catch (err) {
    handleErrorResponse(err);
  }
};

const disLikeBlog = async (req: IRequest, res: Response) => {
  const { params, decoded } = req;

  const { blogId } = params;

  try {
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
  } catch (err) {
    handleErrorResponse(err);
  }
};

const removeBlog = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  try {
    const blogExist = await BlogModel.findById(blogId);

    if (!blogExist) return handleResponse(res, "blog does not exists", 404);

    if (!hasPermission(blogExist.User, req)) {
      return handleResponse(res, "Forbidden", 403);
    }

    await BlogModel.deleteOne({ _id: blogId });

    return handleResponse(res, "Blog deleted successfully.", 200);
  } catch (err) {
    handleErrorResponse(err);
  }
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
