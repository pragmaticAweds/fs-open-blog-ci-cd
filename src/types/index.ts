import { Request } from "express";
import { Document } from "mongoose";

interface CustomIdAttributes {
  _id: string;
  ref: number;
}

interface DocCounterAttributes extends Document {
  lastId: number;
}

interface IToken {
  ref: string;
  username: string;
  isCreator?: boolean;
}

interface IRequest extends Request {
  decoded?: IToken;
}

interface ResponseErrorAttributes {
  message: string;
  status: number;
  extra?: Record<string, any>;
  name?: string;
}

export {
  CustomIdAttributes,
  DocCounterAttributes,
  IRequest,
  IToken,
  ResponseErrorAttributes,
};
