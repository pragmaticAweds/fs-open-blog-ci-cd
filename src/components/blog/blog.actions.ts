import { Response } from "express";
import { handleErrorResponse } from "../../utils/errorHandler";
import { IRequest } from "../../types";

const createBlog = (req: IRequest, res: Response) => {
  try {
  } catch (err) {
    handleErrorResponse(err);
  }
};

const fetchBlogs = (req: IRequest, res: Response) => {
  try {
  } catch (err) {
    handleErrorResponse(err);
  }
};

const fetchSingleBlog = (req: IRequest, res: Response) => {
  try {
  } catch (err) {
    handleErrorResponse(err);
  }
};

const editBlog = (req: IRequest, res: Response) => {
  try {
  } catch (err) {
    handleErrorResponse(err);
  }
};

const removeBlog = (req: IRequest, res: Response) => {
  try {
  } catch (err) {
    handleErrorResponse(err);
  }
};

export { createBlog, fetchBlogs, fetchSingleBlog, removeBlog, editBlog };
