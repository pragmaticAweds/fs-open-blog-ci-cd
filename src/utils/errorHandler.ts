import { NextFunction, Request, Response } from "express";
import { ResponseErrorAttributes } from "../types";

class ResponseError extends Error {
  status: number;
  extra: Record<string, any>;

  constructor({ message, name, status, extra }: ResponseErrorAttributes) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = name || this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";
    this.status = status || 500;

    this.extra = extra || {};
  }
}

const handleErrorResponse = (err: unknown, statusCode?: number) => {
  let { message, extra, status, name } = err as ResponseError;

  switch (true) {
    case name === "CastError":
      message = "Malformatted id";
      status = 400;
      break;

    case name === "ValidationError":
      status = 400;
      break;

    case name === "JsonWebTokenError":
      message = "invalid token";
      status = 401;
      break;

    case name === "TokenExpiredError":
      message = "token expired";
      status = 401;
      break;

    default:
      break;
  }

  throw new ResponseError({
    message,
    status: status || (statusCode as number),
    extra,
    name,
  });
};

const errorHandlerMiddleware = (
  error: ResponseError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, message, extra } = error;

  return res.status(status || 500).json({
    data: {
      message,
      ...(Object.values(extra)?.length && { extra }),
    },
  });
};

export { handleErrorResponse, errorHandlerMiddleware, ResponseError };
