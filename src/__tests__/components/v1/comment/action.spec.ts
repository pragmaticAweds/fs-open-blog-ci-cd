import { afterAll, beforeAll, describe, it } from "vitest";
import mongoose, { Model } from "mongoose";
import supertest from "supertest";

import {
  cleanupTestEnvironment,
  initializeTestEnvironment,
  removeDbCollections,
} from "../../../testHelpers";
import { createNewBlogs } from "../blog/helper";
import BlogModel from "../../../../components/blog/blog.model";
import CommentModel from "../../../../components/comment/comment.model";
import { newCreatorDetails } from "../../../testDatas";
import { createNewUsers } from "../user/helper";
import app from "../../../../app";
import UserModel from "../../../../components/user/user.model";
import UserAccessModel from "../../../../components/auth/auth.model";
import {
  initiateCounterModel,
  removeCounterModel,
} from "../../../../config/initiateCounterModels";
import { connectDb } from "../../../../config/persistence";

const api = supertest(app);

const collections = [
  UserModel,
  UserAccessModel,
  BlogModel,
  CommentModel,
] as unknown as Model<unknown>[];

beforeAll(async () => {
  // await connectDb();
  console.log("Starting from Comment");

  await initializeTestEnvironment();

  console.log("Reemove Counter from Comment");

  // await removeDbCollections(collections);
  // await Promise.all([, ]);

  console.log("Initializing Counter from Comment");
  // await initiateCounterModel();

  console.log("Couunter Initialize");
});

afterAll(async () => {
  await removeDbCollections(collections);
  // await removeCounterModel();
  await cleanupTestEnvironment();
});

describe("Add Comment to a blog", () => {
  let user_one_token = "",
    existingDocId = "",
    blog = null;

  const [creator_one] = newCreatorDetails;

  beforeAll(async () => {
    await UserModel.deleteMany({});
    await UserAccessModel.deleteMany({});

    await createNewUsers();

    const { username, password } = creator_one;

    const { body } = await api
      .post("/api/auth/login")
      .send({ username, password });

    user_one_token = `Bearer ${body.data.token}`;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("POST /comments", async () => {});

  it("EDIT /comments", async () => {});

  it("DELETE /comments", async () => {});
});
