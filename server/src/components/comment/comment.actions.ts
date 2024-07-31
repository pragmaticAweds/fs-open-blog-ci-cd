import { z } from "zod";
import { Response } from "express";
import { IRequest } from "../../types";
import BlogModel from "../blog/blog.model";
import CommentModel from "./comment.model";
import { handleResponse } from "../../utils";
import { addCommentSchema, editCommentSchema } from "./comment.policy";

const getComments = async (req: IRequest, res: Response) => {
  const { blogId } = req.params;

  const blogExist = await BlogModel.findById(blogId, "_id").lean();

  if (!blogExist) return handleResponse(res, "blog does not exists", 404);

  const comments = await CommentModel.find(
    {
      Blog: blogExist._id,
    },
    "text User"
  ).lean();

  if (!comments.length) return handleResponse(res, { data: [] });

  return handleResponse(res, { data: comments });
};

const getSingleComment = async (req: IRequest, res: Response) => {
  const { commentId } = req.params;

  const comment = await CommentModel.findById(commentId).lean();

  if (!comment) return handleResponse(res, "Comment does not exist", 404);

  return handleResponse(res, {
    data: comment,
  });
};

const addComment = async (req: IRequest, res: Response) => {
  const { body, decoded } = req;

  const { blogId, text }: z.infer<typeof addCommentSchema> = body;

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

  return handleResponse(
    res,
    {
      message: "Comment added successfully.",
      data: newComment,
    },
    201
  );
};

const editComment = async (req: IRequest, res: Response) => {
  const { body, decoded, params } = req;

  const { text }: z.infer<typeof editCommentSchema> = body;

  const commentExists = await CommentModel.findById(params.commentId);

  if (!commentExists) {
    return handleResponse(res, "Comment does not exists.", 404);
  }

  if (commentExists?.User !== decoded?.ref) {
    return handleResponse(res, "Forbidden", 403);
  }

  commentExists.text = text as string;

  await commentExists.save();

  return handleResponse(res, {
    message: "Comment edited successfully.",
    data: commentExists,
  });
};
const deleteComment = async (req: IRequest, res: Response) => {
  const { decoded, params } = req;

  const { commentId } = params;

  const comment = await CommentModel.findById(commentId).lean();

  if (!comment) return handleResponse(res, "Comment does not exist", 404);

  if (comment.User !== decoded?.ref) {
    return handleResponse(res, "Forbidden", 403);
  }

  await CommentModel.deleteOne({ _id: comment._id });

  return handleResponse(res, "Comment deleted successfully", 204);
};

export {
  addComment,
  getComments,
  getSingleComment,
  editComment,
  deleteComment,
};
