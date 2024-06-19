import { Model } from "mongoose";
import { BlogCounterModel } from "../components/blog/blog.model";
import { CommentCounterModel } from "../components/comment/comment.model";
import { UserCounterModel } from "../components/user/user.model";
import { DocCounterAttributes } from "../types";
import { UserAccessCounterModel } from "../components/auth/auth.model";

const counterModels = [
  UserCounterModel,
  UserAccessCounterModel,
  BlogCounterModel,
  CommentCounterModel,
] as Model<DocCounterAttributes>[];

const initiateCounterModel = async (models?: Model<DocCounterAttributes>[]) => {
  await Promise.all(
    (models || counterModels).map(async (Model) => {
      const counterExists = await Model.findOne({}).lean();

      if (!counterExists) {
        await new Model({}).save();
      }

      return;
    })
  );
};

const removeCounterModel = async (models?: Model<DocCounterAttributes>[]) =>
  Promise.all((models || counterModels).map((Model) => Model.deleteOne()));

const resetCounterModel = async (models?: Model<DocCounterAttributes>[]) =>
  Promise.all(
    (models || counterModels).map((Model) =>
      Model.updateOne(
        {},
        {
          $set: { lastId: 0 },
        }
      )
    )
  );

export { initiateCounterModel, removeCounterModel, resetCounterModel };
