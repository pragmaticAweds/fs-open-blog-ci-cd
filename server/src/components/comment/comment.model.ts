import { Schema, model } from "mongoose";
import { updateModelCounter } from "../../utils";
import { DocCounterAttributes } from "../../types";
import { CommentAttributes } from "./comment.types";

const commentSchema = new Schema<CommentAttributes>(
  {
    _id: String,
    text: String,
    Blog: { type: String, ref: "Blog" },
    User: { type: String, ref: "User" },
    ref: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  await updateModelCounter(this, CommentCounterModel);

  next();
});

const commentDocCounterSchema = new Schema<DocCounterAttributes>(
  {
    lastId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CommentModel = model("Comment", commentSchema);

export const CommentCounterModel = model(
  "CommentCounter",
  commentDocCounterSchema
);

export default CommentModel;
