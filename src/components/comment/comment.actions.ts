import { z } from "zod";
import { Response } from "express";
import { IRequest } from "../../types";
import BlogModel from "../blog/blog.model";
import CommentModel from "./comment.model";
import { handleResponse } from "../../utils";
import { handleErrorResponse } from "../../utils/errorHandler";
import { addCommentSchema, editCommentSchema } from "./comment.policy";

const getComments = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  try {
    const blogExist = await BlogModel.findById(blogId, "_id").lean();

    if (!blogExist) return handleResponse(res, "blog does not exists", 404);

    const comments = await CommentModel.find(
      {
        Blog: blogExist._id,
      },
      "text User"
    ).lean();

    if (!comments.length)
      return handleResponse(res, { blog: blogExist._id, comments: [] });

    return handleResponse(res, { data: { blog: blogExist._id, comments } });
  } catch (err) {
    handleErrorResponse(err);
  }
};

const getSingleComment = async (req: IRequest, res: Response) => {
  const { blogId, commentId } = req.params;

  try {
    const comment = await CommentModel.findById(commentId).lean();

    if (!comment) return handleResponse(res, "Comment does not exist", 404);

    if (comment.Blog !== blogId) {
      return handleResponse(res, "Comment does not exist", 404);
    }

    return handleResponse(res, {
      data: { blog: blogId, comment },
    });
  } catch (err) {
    handleErrorResponse(err);
  }
};

const addComment = async (req: IRequest, res: Response) => {
  const { body, decoded } = req;

  const { blogId, text }: z.infer<typeof addCommentSchema> = body;

  try {
    const blogExist = await BlogModel.findById(blogId, "_id").lean();

    if (!blogExist) return handleResponse(res, "blog does not exists", 404);

    const comment = await CommentModel.findOne({
      Blog: blogExist._id,
      User: decoded?.ref,
    }).lean();

    if (comment) {
      return handleResponse(res, "You already added a comment");
    }

    const newComment = await new CommentModel({
      text,
      User: decoded?.ref,
      Blog: blogId,
    }).save();

    return handleResponse(res, {
      message: "Comment added successfully.",
      data: { blog: blogExist._id, newComment },
    });
  } catch (err) {
    handleErrorResponse(err);
  }
};

const editComment = async (req: IRequest, res: Response) => {
  const { body, decoded } = req;

  const { commentId, blogId, text }: z.infer<typeof editCommentSchema> = body;

  try {
    const commentExists = await CommentModel.findById(commentId);

    if (!commentExists) {
      return handleResponse(res, "Comment does not exists.", 404);
    }

    if (
      commentExists?.User !== decoded?.ref &&
      commentExists?.Blog !== blogId
    ) {
      return handleResponse(res, "Forbidden", 403);
    }

    commentExists.text = text as string;

    await commentExists.save();

    return handleResponse(res, {
      message: "Comment edited successfully.",
      data: { blog: commentExists.Blog, comment: commentExists },
    });
  } catch (err) {
    handleErrorResponse(err);
  }
};
const deleteComment = async (req: IRequest, res: Response) => {
  const { decoded, params } = req;

  const { commentId, blogId } = params;

  try {
    const comment = await CommentModel.findById(commentId).lean();

    if (!comment) return handleResponse(res, "Comment does not exist", 404);

    if (comment.User !== decoded?.ref || comment.Blog !== blogId) {
      return handleResponse(res, "Forbidden", 404);
    }

    await CommentModel.deleteOne({ _id: comment._id });

    return handleResponse(res, "Comment deleted successfully", 204);
  } catch (err) {
    handleErrorResponse(err);
  }
};

export {
  addComment,
  getComments,
  getSingleComment,
  editComment,
  deleteComment,
};
