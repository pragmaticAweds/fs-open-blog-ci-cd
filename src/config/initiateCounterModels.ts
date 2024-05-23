import { Model } from "mongoose";
import { BlogCounterModel } from "../components/blog/blog.model";
import { CommentCounterModel } from "../components/comment/comment.model";
import { UserCounterModel } from "../components/user/user.model";
import { DocCounterAttributes } from "../types";
import { UserAccessCounterModel } from "../components/auth/auth.model";

const initiateCounterModel = async () => {
  const counterModels = [
    UserCounterModel,
    UserAccessCounterModel,
    BlogCounterModel,
    CommentCounterModel,
  ] as Model<DocCounterAttributes>[];

  await Promise.all(
    counterModels.map(async (Model) => {
      const counterExists = await Model.findOne({}).lean();

      if (!counterExists) return new Model({}).save();

      return;
    })
  );
};

export default initiateCounterModel;
