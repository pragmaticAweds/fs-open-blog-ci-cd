import { Schema, model } from "mongoose";
import UserAccessAttribute from "./auth.types";
import { DocCounterAttributes } from "../../types";
import { updateModelCounter } from "../../utils";
import bcrypt from "bcrypt";
import { appConfig } from "../../config";

const userAccessSchema = new Schema<UserAccessAttribute>(
  {
    _id: String,
    User: String,
    password: String,
    ref: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userAccessSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

userAccessSchema.methods.updatePassword = function (password: string) {
  this.password = password;
};

const userAccessCounterSchema = new Schema<DocCounterAttributes>(
  {
    lastId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userAccessSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(appConfig.authConfig.saltRound);

      this.password = await bcrypt.hash(this.password, salt);
    }
    await updateModelCounter(this, UserAccessCounterModel);

    next();
  } catch (err) {
    throw new Error(err as string);
  }
});

export const UserAccessCounterModel = model(
  "UserAccessCounter",
  userAccessCounterSchema
);

const UserAccessModel = model("UserAccess", userAccessSchema);

export default UserAccessModel;
