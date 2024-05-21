import { Response } from "express";
import { IRequest } from "../../types";
import { handleErrorResponse } from "../../utils/errorHandler";
import UserModel from "../user/user.model";
import { z } from "zod";
import { doSignupSchema } from "./auth.policy";
import { abortSession, commitSession, handleResponse } from "../../utils";
import { startSession } from "mongoose";
import UserAccessModel from "./auth.model";

const doSignup = async (req: IRequest, res: Response) => {
  const {
    name,
    username,
    password,
    is_creator,
  }: z.infer<typeof doSignupSchema> = req.body;

  const session = await startSession();
  session.startTransaction();

  try {
    const userExist = await UserModel.findOne(
      {
        $or: [{ name }, { username }],
      },
      null,
      { session }
    ).lean();

    if (userExist) {
      await abortSession(session);

      return handleResponse(res, "This user already exists.", 409);
    }

    const newUser = new UserModel({
      name,
      username,
      isCreator: is_creator,
    });

    const newUserAccess = new UserAccessModel({ User: newUser._id, password });

    await newUser.save({ session });
    await newUserAccess.save({ session });

    await commitSession(session);

    return handleResponse(
      res,
      {
        message: "New User Created Successfully",
        newUser,
      },
      201
    );
  } catch (err) {
    handleErrorResponse(err);
  }
};

const doLogin = async (req: IRequest, res: Response) => {
  const { body } = req;
  try {
    return res.status(200).json({ ...body });
  } catch (err) {
    handleErrorResponse(err);
  }
};

export { doLogin, doSignup };
