import { beforeAll, beforeEach, describe, it } from "vitest";
import supertest from "supertest";

import { connectDb } from "../../../../config/persistence";

import BlogModel, {
  BlogCounterModel,
} from "../../../../components/blog/blog.model";
import UserModel, {
  UserCounterModel,
} from "../../../../components/user/user.model";
import { removeDbCollections } from "../../../testHelpers";
import { Model } from "mongoose";
import { blogs } from "./helper";
import app from "../../../../app";
import initiateCounterModel from "../../../../config/initiateCounterModels";

const api = supertest(app);

beforeAll(async () => {
  await connectDb();
});

beforeEach(async () => {
  const collections = [
    BlogModel,
    BlogCounterModel,
    UserModel,
    UserCounterModel,
  ] as unknown as Model<unknown>[];

  await removeDbCollections(collections);
}, 10_000);

describe("Testing all blogs", () => {
  it("all blogs are returned", async ({ expect }) => {
    const response = await api.get("/api/blogs");
    console.log(response.status);
    expect(response.body).toHaveLength(blogs.length);
  });
});
