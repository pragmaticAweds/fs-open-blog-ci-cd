import { Response, Router } from "express";
import { IRequest } from "../../types";
import UserModel from "../user/user.model";
import { resetCounterModel } from "../../config/initiateCounterModels";
import BlogModel from "../blog/blog.model";
import CommentModel from "../comment/comment.model";
import UserAccessModel from "../auth/auth.model";
import { handleErrorResponse } from "../../utils/errorHandler";
import { handleResponse } from "../../utils";

const doResetDb = async (req: IRequest, res: Response) => {
  try {
    await Promise.all([
      resetCounterModel(),
      BlogModel.deleteMany(),
      CommentModel.deleteMany(),
      UserModel.deleteMany(),
      UserAccessModel.deleteMany(),
    ]);

    return handleResponse(res, "Reset successful!!!", 204);
  } catch (err) {
    handleErrorResponse(err);
  }
};

const testRouter = Router();

testRouter.get("/reset", doResetDb);

export { testRouter };
