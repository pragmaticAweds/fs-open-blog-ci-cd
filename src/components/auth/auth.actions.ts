import { Response } from "express";
import { IRequest } from "../../types";
import { handleErrorResponse } from "../../utils/errorHandler";
import UserModel from "../user/user.model";
import { z } from "zod";
import { doLoginSchema, doSignupSchema } from "./auth.policy";
import {
  abortSession,
  commitSession,
  generateToken,
  handleResponse,
} from "../../utils";
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

    const newUser = await new UserModel({
      name,
      username,
      isCreator: is_creator,
    }).save({ session });

    await new UserAccessModel({
      User: newUser._id,
      password,
    }).save({ session });

    await commitSession(session);

    const token = await generateToken({
      isCreator: is_creator,
      ref: newUser._id,
      username,
    });

    return handleResponse(
      res,
      {
        message: "New User Created Successfully",
        data: {
          username,
          token,
        },
      },
      201
    );
  } catch (err) {
    handleErrorResponse(err);
  }
};

const doLogin = async (req: IRequest, res: Response) => {
  const { username, password }: z.infer<typeof doLoginSchema> = req.body;

  try {
    const userExist = await UserModel.findOne({ username }).lean();

    if (!userExist) {
      return handleResponse(res, "Invalid credentials", 400);
    }

    const userAccess = await UserAccessModel.findOne({ User: userExist._id });

    if (!userAccess) {
      return handleResponse(res, "Invalid credentials", 400);
    }

    if (!userAccess.comparePassword(password)) {
      return handleResponse(res, "Invalid credentials", 400);
    }

    const { isCreator, _id: userId, username: nickname } = userExist;

    const token = await generateToken({
      isCreator,
      ref: userId,
      username: nickname,
    });

    return handleResponse(res, {
      message: "Login successful",
      data: {
        token,
        username: nickname,
      },
    });
  } catch (err) {
    handleErrorResponse(err);
  }
};

export { doLogin, doSignup };
