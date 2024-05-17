import { Request, Response } from "express";
import { handleErrorResponse } from "../../utils/errorHandler";

const doFetchBlog = (req: Request, res: Response) => {
  try {
    throw new Error("kjkjnk");
  } catch (err) {
    handleErrorResponse(err);
  }
};

export default doFetchBlog;
