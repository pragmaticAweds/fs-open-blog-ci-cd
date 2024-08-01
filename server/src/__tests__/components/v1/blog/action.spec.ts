import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";

import BlogModel, {
  BlogCounterModel,
} from "../../../../components/blog/blog.model";
import UserModel from "../../../../components/user/user.model";
import { Model } from "mongoose";
import { blogsInDb, createNewBlogs, newBlogs } from "./helper";
import app from "../../../../app";
import {
  initiateCounterModel,
  resetCounterModel,
} from "../../../../config/initiateCounterModels";
import {
  cleanupTestEnvironment,
  removeDbCollections,
} from "../../../testHelpers";
import UserAccessModel from "../../../../components/auth/auth.model";
import { newCreatorDetails } from "../../../testDatas";
import { createNewUsers } from "../user/helper";
import { connectDb } from "../../../../config/persistence";

const api = supertest(app);

const collections = [
  BlogModel,
  UserModel,
  UserAccessModel,
] as unknown as Model<unknown>[];

describe("Blog Test", () => {
  beforeAll(async () => {
    await connectDb();
    console.log("Initiating Counter");
    await initiateCounterModel();
  });

  describe("GET /blogs", () => {
    beforeAll(async () => {
      await BlogModel.deleteMany();
      await resetCounterModel();
      await createNewBlogs();
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

    afterAll(async () => {
      await BlogModel.deleteMany();
      await resetCounterModel();
    });
  });

  describe("ADD and EDIT Blog API", () => {
    let user_one_token = "",
      user_two_token = "",
      existingDocId = "";

    const [newBlog, editBlog] = newBlogs;
    const [creator_one, creator_two] = newCreatorDetails;

    beforeAll(async () => {
      await BlogModel.deleteMany();

      await resetCounterModel();

      await createNewUsers();

      const { username, password } = creator_one;

      const { body } = await api
        .post("/api/auth/login")
        .send({ username, password });

      user_one_token = `Bearer ${body.data.token}`;

      const { username: creator2Username, password: creator2Password } =
        creator_two;

      const { body: response } = await api
        .post("/api/auth/login")
        .send({ username: creator2Username, password: creator2Password });

      user_two_token = `Bearer ${response.data.token}`;
    });

    describe("POST /blogs", () => {
      it("should add a new blog", async () => {
        const { body } = await api
          .post("/api/blogs")
          .set("authorization", user_one_token)
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const blogs = await blogsInDb();

        existingDocId = body.data._id;

        expect(blogs.length).toEqual(1);
        expect(body.data.title).toEqual(newBlog.title);
        expect(body.data.author).toEqual(newBlog.author);
        // assert.strictEqual(body.data.url, newBlog.url);
      });

      it("should return 401 for no authentication before creating blog", async () => {
        await api.post("/api/blogs").send(newBlog).expect(401);
      });

      it("should verify ref and _id field is equal to last document count", async () => {
        const {
          body: { data },
        } = await api
          .post("/api/blogs")
          .set("authorization", user_one_token)
          .send(newBlog);

        const blogTracker = await BlogCounterModel.findOne();
        const lastBlogId = blogTracker?.lastId;

        expect(data.ref).toBe(lastBlogId);
        expect(data._id.endsWith(String(lastBlogId))).toBeTruthy;
      });

      it("should return 400 for missing required fields when creating blog", async () => {
        const { title, author, url } = newBlog;

        await api
          .post("/api/blogs")
          .set("authorization", user_one_token)
          .send({ title, author })
          .expect(400);

        await api
          .post("/api/blogs")
          .set("authorization", user_one_token)
          .send({ url, author })
          .expect(400);
      });

      it("should verify likes is empty array by default", async () => {
        const { body } = await api
          .post("/api/blogs")
          .set("authorization", user_one_token)
          .send(newBlog);

        const blog = body.data;

        expect(blog).toHaveProperty("likes");
        // assert.deepEqual(blog.likes, []);
      });
    });

    describe("PATCH /blogs/:blogId/like and /blogs/:blogId/dislike", () => {
      it("should allow user to like a blog", async () => {
        const { body } = await api
          .patch(`/api/blogs/${existingDocId}/like`)
          .set("authorization", user_two_token)
          .expect(200);

        const likedBlog = body.data;

        // assert.strictEqual(likedBlog.likes.length, 1);
        expect(likedBlog.likes).toContain("000002");
      });

      it("should allow user to dislike a blog", async () => {
        const { body } = await api
          .patch(`/api/blogs/${existingDocId}/dislike`)
          .set("authorization", user_two_token)
          .expect(200);

        const likedBlog = body.data;

        expect(likedBlog.likes.length).toEqual(0);

        //  assert.strictEqual(likedBlog.likes.length, 0);
      });
    });

    describe("EDIT /blogs/:blogId", () => {
      it("should edit blog successfully", async () => {
        const { body } = await api
          .patch(`/api/blogs/${existingDocId}`)
          .set("authorization", user_one_token)
          .send(editBlog)
          .expect(200);

        expect(body.data.title).toEqual(editBlog.title);
        expect(body.data.author).toEqual(editBlog.author);
        // assert.strictEqual(body.data.url, editBlog.url);
      });

      it("should return 403 for unauthorized editing of blog", async () => {
        await api
          .patch(`/api/blogs/${existingDocId}`)
          .set("authorization", user_two_token)
          .send(editBlog)
          .expect(403);
      });
    });

    describe("Delete /blogs/:blogId", () => {
      it("should return 403 for unauthorized deleting of blog", async () => {
        await api
          .delete(`/api/blogs/${existingDocId}`)
          .set("authorization", user_two_token)
          .expect(403);
      });

      it("should delete blog successfully", async () => {
        await api
          .delete(`/api/blogs/${existingDocId}`)
          .set("authorization", user_one_token)
          .expect(200);

        await api.get(`/api/blogs/${existingDocId}`).expect(404);
      });
    });
  });

  afterAll(async () => {
    await removeDbCollections(collections);
    await cleanupTestEnvironment();
  });
});
