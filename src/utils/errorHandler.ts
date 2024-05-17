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
  const { message, extra, status } = err as ResponseError;

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

export { handleErrorResponse, errorHandlerMiddleware };
