import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

export interface BlogAttributes
  extends CustomIdAttributes,
    Omit<Document, "_id"> {
  title: string;
  author: string;
  url: string;
  likes: string[];
  User: string;
  comments: [];
}
