import { NextFunction, Response } from "express";
import { IRequest, IToken } from "../../types";
import jwt from "jsonwebtoken";
import { handleErrorResponse } from "../../utils/errorHandler";
import { appConfig } from "../../config";

const { authConfig } = appConfig;

const verifyToken = (req: IRequest, res: Response, next: NextFunction) => {
  let token = (req.headers["authorization"] ||
    req.headers["x-access-token"]) as string;

  token = token?.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, authConfig.jwtSecret);

    req.decoded = decodedToken as IToken;

    if (!req.decoded) throw new Error("Forbidden");

    return next();
  } catch (err) {
    handleErrorResponse(err);
  }
};

export { verifyToken };
