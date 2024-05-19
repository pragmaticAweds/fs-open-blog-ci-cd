import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

interface CommentAttributes extends CustomIdAttributes, Omit<Document, "_id"> {
  text: string;
  Blog: string;
  User: string;
}

export { CommentAttributes };
