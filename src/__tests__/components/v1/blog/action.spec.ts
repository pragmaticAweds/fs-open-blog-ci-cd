import { afterAll, beforeAll, beforeEach, describe, it, test } from "vitest";
import supertest from "supertest";

import { closeDb, connectDb } from "../../../../config/persistence";

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

beforeAll(() => {
  connectDb();
});

beforeEach(() => {
  const collections = [
    BlogModel,
    BlogCounterModel,
    UserModel,
    UserCounterModel,
  ] as unknown as Model<unknown>[];

  removeDbCollections(collections);
});

describe("Testing blogs", () => {
  test("all blogs are returned", async ({ expect }) => {
    const response = await api.get("/api/blogs");
    expect(response.body.data).toHaveLength(blogs.length);
  }, 7_000);
  test("Blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  closeDb();
});

beforeEach(async () => {
  const newUser = {
    username: "john_doe",
    password: "John.Doe1",
    name: "john doe",
  };

  const loginUser = {
    username: "john_doe",
    password: "John.Doe1",
  };

  const result = await api.post("/api/auth/signup").send(newUser);

  console.log(result.statusCode);

  const tokenResult = await api.post("/api/auth/login").send(loginUser);

  console.log(result.statusCode);

  let headers = `bearer ${tokenResult.body.token}`;
});
