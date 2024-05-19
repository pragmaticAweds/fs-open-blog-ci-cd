import { NextFunction, Request, Response } from "express";

class ResponseError extends Error {
  status: number;
  extra: Record<string, any>;

  constructor(message?: string, status?: number, extra?: Record<string, any>) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = extra?.name || this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";
    this.status = status || 500;

    this.extra = extra || {};
  }
}

const handleErrorResponse = (err: unknown) => {
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

  throw new ResponseError(message, status, extra);
};

const errorHandlerMiddleware = (
  error: ResponseError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const { stack, ...errData } = error;

  return res.status(error.status || 500).json({
    error: errData,
  });
};

export { handleErrorResponse, errorHandlerMiddleware, ResponseError };
