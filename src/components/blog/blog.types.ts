import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

export interface BlogAttributes
  extends Omit<Document, "_id">,
    CustomIdAttributes {
  title: string;
  author: string;
  url: string;
  likes: number;
  User: string;
  comments: [];
}
