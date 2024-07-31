import { NextFunction, Response } from "express";
import { IRequest, IToken } from "../../types";
import jwt from "jsonwebtoken";
import { ResponseError } from "../../utils/errorHandler";
import { appConfig } from "../../config";
import UserModel from "../user/user.model";

const { authConfig } = appConfig;

const verifyToken = async (
  req: IRequest,
  _res: Response,
  next: NextFunction
) => {
  let token = (req.headers["authorization"] ||
    req.headers["x-access-token"]) as string;

  token = token?.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, authConfig.jwtSecret);

    req.decoded = decodedToken as IToken;

    if (!req.decoded) {
      throw new ResponseError({
        message: "Authentication is Required",
        status: 401,
      });
    }

    const userExist = await UserModel.findOne({
      username: req.decoded.username,
    });

    if (!userExist) {
      throw new ResponseError({
        message: "Authentication is Required",
        status: 401,
      });
    }

    return next();
  } catch (err) {
    next(err);
  }
};

export { verifyToken };
