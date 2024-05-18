import { Schema, model } from "mongoose";
import { BlogAttributes } from "./blog.types";
import { DocCounterAttributes } from "../../types";

const blogSchema = new Schema<BlogAttributes>(
  {
    _id: String,
    title: String,
    author: String,
    url: String,
    likes: Number,
    User: { type: String, ref: "User" },
    ref: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const blogCounterSchema = new Schema<DocCounterAttributes>(
  {
    lastId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre<BlogAttributes>("save", async function (next) {
  if (this.isNew) {
  }

  next();
});

const BlogModel = model("Blog", blogSchema);

export const BlogCounterModel = model("BlogCounter", blogCounterSchema);

export default BlogModel;
