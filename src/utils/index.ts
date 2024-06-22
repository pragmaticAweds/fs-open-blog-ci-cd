/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import { ClientSession, Document, Model } from "mongoose";

import jwt from "jsonwebtoken";

import { Schema } from "zod";

import { CustomIdAttributes, DocCounterAttributes, IRequest } from "../types";

import { handleErrorResponse } from "./errorHandler";

import { appConfig } from "../config";
import UserModel from "../components/user/user.model";

const incrementDocId = (id: number) => String(id).padStart(6, "0");

const updateModelCounter = async (
  doc: Document & CustomIdAttributes,
  CounterModel: Model<DocCounterAttributes>
) => {
  try {
    if (doc.isNew && !doc.ref) {
      const session = doc.$session();

      const docCounter = await CounterModel.findOne({}, null, {
        ...(session && { session }),
      }).lean();

      if (!docCounter) return;

      const { lastId, _id: counterId } = docCounter;

      doc.ref = lastId + 1;

      doc._id = incrementDocId(doc.ref);

      return CounterModel.updateOne(
        { _id: counterId },
        { $inc: { lastId: 1 } },
        { ...(session && { session }) }
      );
    }
  } catch (err) {
    console.log({ msg: "Error incrementing counter:", err }, "error");
    throw err; // Propagate the error to the caller
  }
};

const policyMiddleware =
  (schema: Schema, fieldType: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      let parsedData;

      if (fieldType === "body") {
        parsedData = schema.parse(req.body);
        req.body = parsedData;
      } else if (fieldType === "params") {
        parsedData = schema.parse(req.params);
        req.params = parsedData;
      } else if (fieldType === "query") {
        parsedData = schema.parse(req.query);
        req.query = parsedData;
      }

      return next();
    } catch (err) {
      const message = `${(err as Record<string, any>).issues[0].path[0]} ${
        (err as Record<string, any>).issues[0].message
      }`.toLowerCase();

      const error = {
        ...(err as Record<string, unknown>),
        message,
        status: 400,
        name: "Bad Request",
      };

      handleErrorResponse(error);
    }
  };

const unknownEndpoint = (req: Request, res: Response) =>
  res.status(404).send({ error: "unknown endpoint" });

const handleResponse = (res: Response, data: unknown, status = 200) => {
  if (typeof data === "string")
    return res.status(status).json({ message: data });

  return res.status(status).json(data);
};

const hasPermission = (userId: string, req: IRequest) => {
  const { decoded } = req;

  if (!userId || !decoded) return false;

  if (!decoded.ref || decoded.ref !== userId) return false;

  return true;
};

const isCreatorMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { decoded } = req;

    if (!decoded || !decoded?.ref) throw Error("Forbidden");

    const userExist = await UserModel.findById(decoded?.ref).lean();

    if (!userExist || !userExist.isCreator) {
      return handleResponse(res, { data: { message: "Forbidden" } }, 403);
    }

    next();
  } catch (err) {
    return handleErrorResponse(err, 403);
  }
};

const commitSession = async (session: ClientSession) => {
  await session.commitTransaction();
  session.endSession();
};

const abortSession = async (session: ClientSession) => {
  await session.abortTransaction();
  session.endSession();
};

const generateToken = async (payload: unknown) => {
  const { authConfig } = appConfig;

  return jwt.sign(payload as string, authConfig.jwtSecret);
};

export {
  incrementDocId,
  isCreatorMiddleware,
  updateModelCounter,
  policyMiddleware,
  unknownEndpoint,
  handleResponse,
  hasPermission,
  generateToken,
  commitSession,
  abortSession,
};
