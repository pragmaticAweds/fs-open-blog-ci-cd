import { NextFunction, Request, Response } from "express";
import { ResponseErrorAttributes } from "../types";

class ResponseError extends Error {
  status: number;
  extra: Record<string, never>;

  constructor({ message, name, status, extra }: ResponseErrorAttributes) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name || this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";
    this.status = status || 500;

    this.extra = extra || {};

    Error.captureStackTrace(this);
  }
}

const handleErrorResponse = (err: unknown, statusCode?: number): never => {
  let { message, status } = err as ResponseError;
  const { extra, name } = err as ResponseError;

  switch (true) {
    case name === "CastError":
      message = "Malformatted id";
      status = 400;
      break;
    case name === "ValidationError":
      status = 400;
      break;
    case name === "JsonWebTokenError":
      message = "Invalid token";
      status = 401;
      break;
    case name === "TokenExpiredError":
      message = "Token expired";
      status = 401;
      break;
    case name === "MongooseError":
      status = 400;
      break;
    default:
      break;
  }

  throw new ResponseError({
    name,
    message,
    status: statusCode || status,
    extra,
  });
};

const errorHandlerMiddleware = (
  error: ResponseError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
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
