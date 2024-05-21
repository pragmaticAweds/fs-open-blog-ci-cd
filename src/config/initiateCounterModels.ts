import UserAccessModel from "../components/auth/auth.model";
import { BlogCounterModel } from "../components/blog/blog.model";
import { CommentCounterModel } from "../components/comment/comment.model";
import { UserCounterModel } from "../components/user/user.model";

const initiateCounterModel = async () => {
  const counterModels = [
    UserCounterModel,
    UserAccessModel,
    BlogCounterModel,
    CommentCounterModel,
  ];

  await Promise.all(async (model) => {
    const Model = model as (typeof counterModels)[number];

    const modelExists = await Model.findOne();
  });
};
