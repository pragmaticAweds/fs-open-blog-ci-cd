import { Model } from "mongoose";
import supertest from "supertest";

import BlogModel from "../../../../components/blog/blog.model";
import CommentModel from "../../../../components/comment/comment.model";
import { newCreatorDetails } from "../../../testDatas";
import { createNewUsers } from "../user/helper";
import app from "../../../../app";
import UserModel from "../../../../components/user/user.model";
import UserAccessModel from "../../../../components/auth/auth.model";
import {
  initiateCounterModel,
  resetCounterModel,
} from "../../../../config/initiateCounterModels";
import { connectDb } from "../../../../config/persistence";
import {
  removeDbCollections,
  cleanupTestEnvironment,
} from "../../../testHelpers";

const api = supertest(app);

const collections = [
  UserModel,
  UserAccessModel,
  BlogModel,
  CommentModel,
] as unknown as Model<unknown>[];

describe("Comment Test", () => {
  beforeAll(async () => {
    await connectDb();
    console.log("Initiating Counter");
    await initiateCounterModel();
  });

  describe("Add Comment to a blog", () => {
    let user_one_token = "",
      existingDocId = "",
      blog = null;

    const [creator_one] = newCreatorDetails;

    beforeAll(async () => {
      await createNewUsers(0, 1);

      const { username, password } = creator_one;

      const { body } = await api
        .post("/api/auth/login")
        .send({ username, password });

      user_one_token = `Bearer ${body.data.token}`;
    });

    afterAll(async () => {
      await UserModel.deleteMany();
      await UserAccessModel.deleteMany();
      await resetCounterModel();
    });

    it("POST /comments", async () => {});

    it("EDIT /comments", async () => {});

    it("DELETE /comments", async () => {});
  });

  afterAll(async () => {
    await removeDbCollections(collections);
    await cleanupTestEnvironment();
  });
});
