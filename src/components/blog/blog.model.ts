import { Schema } from "mongoose";
import { BlogAttributes } from "./blog.types";
import { DocCounterAttributes } from "../../types";

const blogSchema = new Schema<BlogAttributes>({
  _id: String,
  title: String,
  author: String,
  url: String,
  likes: Number,
  User: { type: String, ref: "User" },
  ref: { type: Number, default: 0 },
});

const blogCounterSchema = new Schema<DocCounterAttributes>({
  lastId: { type: Number, default: 0 },
});
