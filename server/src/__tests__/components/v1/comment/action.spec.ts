import { Model } from "mongoose";
import supertest from "supertest";

import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import BlogModel from "../../../../components/blog/blog.model";
import CommentModel from "../../../../components/comment/comment.model";
import { newCreatorDetails } from "../../../testDatas";
import { createNewUsers } from "../user/helper";
import app from "../../../../app";
import UserModel from "../../../../components/user/user.model";
import UserAccessModel from "../../../../components/auth/auth.model";
import { initiateCounterModel } from "../../../../config/initiateCounterModels";
import { connectDb } from "../../../../config/persistence";
import {
  removeDbCollections,
  cleanupTestEnvironment,
} from "../../../testHelpers";
import { createNewBlogs } from "../blog/helper";
import { BlogAttributes } from "../../../../components/blog/blog.types";

const api = supertest(app);

const collections = [
  UserModel,
  UserAccessModel,
  BlogModel,
  CommentModel,
] as unknown as Model<unknown>[];

describe("Comment Test", () => {
  let user_one_token = "",
    user_two_token = "",
    existingCommentId = "",
    blog: BlogAttributes;

  beforeAll(async () => {
    await connectDb();
    await initiateCounterModel();

    const [creator_one, creator_two] = newCreatorDetails;

    await createNewUsers();
    await createNewBlogs({ start: 0, end: 1 });

    const { username, password } = creator_one;
    const { username: username_two, password: password_two } = creator_two;

    const { body } = await api
      .post("/api/auth/login")
      .send({ username, password });

    const { body: res } = await api
      .post("/api/auth/login")
      .send({ username: username_two, password: password_two });

    user_one_token = `Bearer ${body.data.token}`;
    user_two_token = `Bearer ${res.data.token}`;
  });

  describe("POST /comments", () => {
    it("Should return 401 for unauthenticated user", async () => {
      blog = (await BlogModel.findOne()) as BlogAttributes;

      await api
        .post("/api/comments")
        .send({
          blogId: blog?._id,
          text: "I like this content",
        })
        .expect(401);
    });

    it("Should return 201 successful for authenticated user.", async () => {
      const { body } = await api
        .post("/api/comments")
        .set("authorization", user_one_token)
        .send({
          blogId: blog?._id,
          text: "I like this content",
        })
        .expect(201);

      existingCommentId = body.data._id;

      expect(body.data).toHaveProperty("text", "I like this content");
      expect(body.data).toHaveProperty("Blog", blog?._id);
      expect(body.data).toHaveProperty("User", "000001");
    });
  });

  describe("EDIT /comments", () => {
    it("Should return 401 for unauthenticated user", async () => {
      await api
        .patch(`/api/comments/${existingCommentId}`)
        .send({
          text: "I like this content",
        })
        .expect(401);
    });
    it("Should return 403 for wrong user", async () => {
      await api
        .patch(`/api/comments/${existingCommentId}`)
        .set("authorization", user_two_token)
        .send({
          text: "This is the updated content",
        })
        .expect(403);
    });

    it("Should return 200 for changing comment", async () => {
      const { body } = await api
        .patch(`/api/comments/${existingCommentId}`)
        .set("authorization", user_one_token)
        .send({
          text: "This is the updated content",
        })
        .expect(200);

      expect(body.data).toHaveProperty("text", "This is the updated content");
    });
  });

  describe("GET /comments", () => {
    it("Should return all comments of a blog", async () => {
      const { body } = await api
        .get(`/api/comments/blogs/${blog?._id}`)
        .expect(200);

      expect(body.data.length).toBe(1);
    });

    it("Should return a single blog", async () => {
      const { body } = await api
        .get(`/api/comments/${existingCommentId}`)
        .expect(200);

      expect(body.data.text).toBeTruthy();
      expect(body.data.Blog).toEqual(blog._id);
    });
  });

  describe("DELETE /comments", () => {
    it("Should return 401 for unauthenticated user", async () => {
      await api.delete(`/api/comments/${existingCommentId}`).expect(401);
    });
    it("Should return 403 for wrong user", async () => {
      await api
        .delete(`/api/comments/${existingCommentId}`)
        .set("authorization", user_two_token)
        .expect(403);
    });

    it("Should return 204 for changing comment", async () => {
      await api
        .delete(`/api/comments/${existingCommentId}`)
        .set("authorization", user_one_token)
        .expect(204);
    });
  });

  afterAll(async () => {
    await removeDbCollections(collections);
    await cleanupTestEnvironment();
  });
});
