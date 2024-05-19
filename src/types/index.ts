import { Request } from "express";
import { Document } from "mongoose";
import UserAccessAttribute from "../components/auth/auth.types";

interface CustomIdAttributes {
  _id: string;
  ref: number;
}

interface DocCounterAttributes extends Document {
  lastId: number;
}

interface IRequest extends Request {
  isCreator?: boolean;
  UserAccess: UserAccessAttribute;
  decoded: {};
}

export { CustomIdAttributes, DocCounterAttributes, IRequest };
