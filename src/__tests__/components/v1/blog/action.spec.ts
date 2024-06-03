import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";
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
import { blogs, blogsInDb } from "./helper";
import app from "../../../../app";
import initiateCounterModel from "../../../../config/initiateCounterModels";

const api = supertest(app);

beforeAll(() => {
  connectDb();
  initiateCounterModel();
});

beforeEach(() => {
  const collections = [BlogModel, UserModel] as unknown as Model<unknown>[];

  removeDbCollections(collections);
});

describe("Testing blogs", () => {
  test("all blogs are returned", async ({ expect }) => {
    const response = await api.get("/api/blogs");
    expect(response.body.data).toHaveLength(blogs.length);
  });
  test("Blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  const collections = [
    BlogCounterModel,
    UserCounterModel,
  ] as unknown as Model<unknown>[];

  removeDbCollections(collections);
  closeDb();
});

let headers;

beforeEach(async () => {
  const newUser = {
    username: "john_doe",
    password: "John.Doe1",
    name: "john doe",
    is_creator: true,
  };

  const loginUser = {
    username: "john_doe",
    password: "John.Doe1",
  };

  const result = await api.post("/api/auth/signup").send(newUser);

  console.log("signup", result.statusCode);

  const tokenResult = await api.post("/api/auth/login").send(loginUser);

  console.log(result.statusCode);

  headers = `bearer ${tokenResult.body.token}`;
});

describe("Create new blog", () => {
  test("verify new blog is posted successfully", async ({ expect }) => {
    const localDb = await blogsInDb();
    const newBlog = localDb[0];

    await api
      .post("/api/blogs")
      .set("Authorization", headers)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const result = await api.get("/api/blogs");
    expect(result.body).toHaveLength(blogs.length + 1);

    const contents = result.body.map((content) => content.title);

    expect(contents).toContain("First classs");
  }, 30_000);
});
