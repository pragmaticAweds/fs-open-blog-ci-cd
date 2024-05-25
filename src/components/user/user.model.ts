import { Schema, model } from "mongoose";
import UserAttributes from "./user.types";
import { DocCounterAttributes } from "../../types";
import { updateModelCounter } from "../../utils";

const userSchema = new Schema<UserAttributes>(
  {
    _id: String,
    username: { type: String, lowercase: true },
    name: { type: String },
    avatar: String,
    isCreator: { type: Boolean, default: false },
    ref: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  await updateModelCounter(this, UserCounterModel);

  next();
});

const userDocCounterSchema = new Schema<DocCounterAttributes>(
  {
    lastId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

export const UserCounterModel = model("UserCounter", userDocCounterSchema);

export default UserModel;
