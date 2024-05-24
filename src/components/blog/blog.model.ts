import { Schema, model } from "mongoose";
import { BlogAttributes } from "./blog.types";
import { DocCounterAttributes } from "../../types";
import { updateModelCounter } from "../../utils";

const blogSchema = new Schema<BlogAttributes>(
  {
    _id: String,
    title: String,
    author: String,
    url: String,
    likes: [{ type: String, ref: "User" }],
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

blogSchema.pre("save", async function (next) {
  await updateModelCounter(this, BlogCounterModel);

  next();
});

const BlogModel = model("Blog", blogSchema);

export const BlogCounterModel = model("BlogCounter", blogCounterSchema);

export default BlogModel;
