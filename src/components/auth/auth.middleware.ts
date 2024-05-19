import { NextFunction, Response } from "express";
import { IRequest } from "../../types";
import jwt from "jsonwebtoken";
import { handleErrorResponse } from "../../utils/errorHandler";
import { appConfig } from "../../config";

const { authConfig } = appConfig;

const verifyToken = (req: IRequest, res: Response, next: NextFunction) => {
  let token = (req.headers["authorization"] ||
    req.headers["x-access-token"]) as string;

  token = token.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decodedToken = jwt.verify(token, authConfig.jwtSecret);

    req.decoded = decodedToken;

    return next();
  } catch (err) {
    handleErrorResponse(err);
  }
};

export { verifyToken };
