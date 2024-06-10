import { afterAll, assert, beforeAll, describe, it, test } from "vitest";
import supertest from "supertest";

import { closeDb, connectDb } from "../../../../config/persistence";

import BlogModel, {
  BlogCounterModel,
} from "../../../../components/blog/blog.model";
import UserModel from "../../../../components/user/user.model";
import { Model } from "mongoose";
import { blogsInDb, createNewBlogs, newBlogs } from "./helper";
import app from "../../../../app";
import {
  initiateCounterModel,
  removeCounterModel,
} from "../../../../config/initiateCounterModels";
import {
  cleanupTestEnvironment,
  initializeTestEnvironment,
  removeDbCollections,
} from "../../../testHelpers";
import UserAccessModel from "../../../../components/auth/auth.model";
import { creatorLoginDetails, newCreatorDetails } from "../../../testDatas";

const api = supertest(app);

const collections = [
  UserModel,
  UserAccessModel,
  BlogModel,
] as unknown as Model<unknown>[];

const clearCollections = async () => {
  await removeDbCollections(collections);
};

beforeAll(initializeTestEnvironment);
afterAll(cleanupTestEnvironment);

describe("GET /blogs", () => {
  beforeAll(async () => {
    await createNewBlogs();
  });

  afterAll(async () => {
    await BlogModel.deleteMany();
  });

  it("should return all blogs", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should fetch a single blog", async () => {
    await api.get("/api/blogs/1").expect(404);
    await api.get("/api/blogs/000001").expect(200);
  });
});

describe("ADD and EDIT Blog API", () => {
  let headers = "",
    existingDocId = "";

  const [newBlog, editBlog] = newBlogs;

  beforeAll(async () => {
    await api.post("/api/auth/signup").send(newCreatorDetails);

    const { body } = await api
      .post("/api/auth/login")
      .send(creatorLoginDetails);

    headers = `Bearer ${body.data.token}`;
  });

  afterAll(clearCollections);

  describe("POST /blogs", () => {
    it("should add a new blog", async ({ expect }) => {
      const { body } = await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await blogsInDb();

      existingDocId = body.data._id;

      expect(blogs.length).toEqual(1);
      expect(body.data.title).toEqual(newBlog.title);
      expect(body.data.author).toEqual(newBlog.author);
      assert.strictEqual(body.data.url, newBlog.url);
    });

    it("should return 401 for no authentication before creating blog", async () => {
      await api.post("/api/blogs").send(newBlog).expect(401);
    });

    it("should verify ref and _id field is equal to last document count", async () => {
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

    it("should return 400 for missing required fields when creating blog", async () => {
      const { title, author, url } = newBlog;

      await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send({ title, author })
        .expect(400);

      await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send({ url, author })
        .expect(400);

      await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send({ url, title })
        .expect(400);
    });

    it("should verify likes is empty array by default", async ({ expect }) => {
      const { body } = await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send(newBlog);

      const blog = body.data;

      expect(blog).toHaveProperty("likes");
      assert.deepEqual(blog.likes, []);
    });
  });

  describe("EDIT /blogs/:blogId", () => {
    it("should edit blog successfully", async ({ expect }) => {
      const { body } = await api
        .patch(`/api/blogs/${existingDocId}`)
        .set("authorization", headers)
        .send(editBlog)
        .expect(200);

      expect(body.data.title).toEqual(editBlog.title);
      expect(body.data.author).toEqual(editBlog.author);
      assert.strictEqual(body.data.url, editBlog.url);
    });
  });

  describe("Delete /blogs/:blogId", () => {
    it("should delete blog successfully", async ({ expect }) => {
      await api
        .delete(`/api/blogs/${existingDocId}`)
        .set("authorization", headers)
        .expect(204);

      await api.get(`/api/blogs/${existingDocId}`).expect(404);

      // expect(body.data.title).toEqual(editBlog.title);
      // expect(body.data.author).toEqual(editBlog.author);
      // assert.strictEqual(body.data.url, editBlog.url);
    });
  });
});
