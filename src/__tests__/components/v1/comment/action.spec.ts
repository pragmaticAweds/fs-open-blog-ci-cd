import { afterAll, beforeAll, describe, it } from "vitest";
import { Model } from "mongoose";
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
  BlogModel,
  CommentModel,
  UserModel,
  UserAccessModel,
] as unknown as Model<unknown>[];

beforeAll(async () => {
  console.log("Starting from Comment");
  await connectDb();

  console.log("Reemove Counter from Comment");

  await removeCounterModel();

  await removeDbCollections(collections);
  // await Promise.all([, ]);

  // await initializeTestEnvironment();
  console.log("Initializing Counter from Comment");
  await initiateCounterModel();

  console.log("Couunter Initialize");
});

afterAll(async () => {
  await removeDbCollections(collections);
  await cleanupTestEnvironment();
});

describe("Add Comment to a blog", () => {
  let user_one_token = "",
    existingDocId = "",
    blog = null;

  const [creator_one] = newCreatorDetails;

  beforeAll(async () => {
    await createNewUsers();

    const { username, password } = creator_one;

    const { body } = await api
      .post("/api/auth/login")
      .send({ username, password });

    user_one_token = `Bearer ${body.data.token}`;
  });
  it("POST /comments", async () => {});

  it("EDIT /comments", async () => {});

  it("DELETE /comments", async () => {});
});
