import { afterAll, assert, beforeAll, describe, test } from "vitest";
import supertest from "supertest";

import { closeDb, connectDb } from "../../../../config/persistence";

import BlogModel, {
  BlogCounterModel,
} from "../../../../components/blog/blog.model";
import UserModel, {
  UserCounterModel,
} from "../../../../components/user/user.model";
import { Model } from "mongoose";
import { blogsInDb, newBlogs } from "./helper";
import app from "../../../../app";
import {
  initiateCounterModel,
  removeCounterModel,
} from "../../../../config/initiateCounterModels";
import { removeDbCollections } from "../../../testHelpers";
import UserAccessModel from "../../../../components/auth/auth.model";

const api = supertest(app);

beforeAll(async () => {
  await connectDb();
  await initiateCounterModel();
});

afterAll(async () => {
  await removeCounterModel();
  await closeDb();
});

describe("Testing blogs", () => {
  test("all Blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Create new blog", () => {
  let headers = "";

  const newBlog = newBlogs[1];

  beforeAll(async () => {
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

    await api.post("/api/auth/signup").send(newUser);

    const { body } = await api.post("/api/auth/login").send(loginUser);

    headers = `Bearer ${body.data.token}`;
  });

  afterAll(async () => {
    const collections = [
      UserModel,
      UserAccessModel,
      BlogModel,
    ] as unknown as Model<unknown>[];

    await removeDbCollections(collections);
  });

  test("verify new blog is posted successfully", async ({ expect }) => {
    await api
      .post("/api/blogs")
      .set("authorization", headers)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { body } = await api.get("/api/blogs");

    const blogs = await blogsInDb();

    expect(body.data).toHaveLength(blogs.length);
  });

  test("ref field is equal to last document id", async () => {
    const {
      body: { data },
    } = await api
      .post("/api/blogs")
      .set("authorization", headers)
      .send(newBlog);

    const blogTracker = await BlogCounterModel.findOne();

    const lastBlogId = blogTracker?.lastId;

    assert.strictEqual(data.ref, lastBlogId);

    assert.isTrue(data._id.endsWith(String(lastBlogId)));
  });

  test("Incomplete blog returns 400 Bad Request", async ({ expect }) => {
    const { title, author } = newBlog;

    await api
      .post("/api/blogs")
      .set("authorization", headers)
      .send({ title, author })
      .expect(400);
  });
});
