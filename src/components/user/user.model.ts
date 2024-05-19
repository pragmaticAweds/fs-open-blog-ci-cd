import { Schema, model } from "mongoose";
import UserAttributes from "./user.types";
import { DocCounterAttributes } from "../../types";
import { updateModelCounter } from "../../utils";

const userSchema = new Schema<UserAttributes>({
  id: String,
  username: { type: String, unique: true, lowercase: true },
  name: { type: String, unique: true },
  avatar: String,
  isCreator: { type: Boolean, default: false },
  ref: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  await updateModelCounter(this, UserCounterModel);

  next();
});

userSchema.set("toJSON", {
  transform: async (doc, returnedObj) => {
    console.log(JSON.stringify({ returnedObj, doc }, null, 2));

    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const userDocCounterSchema = new Schema<DocCounterAttributes>({
  lastId: { type: Number, default: 0 },
});

const UserModel = model("User", userSchema);

export const UserCounterModel = model("UserCounter", userDocCounterSchema);

export default UserModel;
