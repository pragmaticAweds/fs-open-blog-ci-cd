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
import { createNewBlogs } from "../blog/helper";

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
    await initiateCounterModel();
  });

  describe("Add Comment to a blog", () => {
    let user_one_token = "",
      existingCommentId = "",
      blog;

    const [creator_one] = newCreatorDetails;

    beforeAll(async () => {
      await createNewUsers(0, 1);
      await createNewBlogs({ start: 0, end: 1 });

      const { username, password } = creator_one;

      const { body } = await api
        .post("/api/auth/login")
        .send({ username, password });

      user_one_token = `Bearer ${body.data.token}`;
    });

    afterAll(async () => {
      await removeDbCollections(collections);
      await resetCounterModel();
    });

    it("POST /comments", async () => {
      blog = await BlogModel.findOne();

      expect(blog).toBeTruthy;

      await api
        .post("/api/comments")
        .send({
          blogId: blog?._id,
          text: "I like this content",
        })
        .expect(401);

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

    it("EDIT /comments", async () => {
      await api
        .patch(`/api/comments/${existingCommentId}`)
        .send({
          text: "I like this content",
        })
        .expect(401);

      const { body } = await api
        .patch(`/api/comments/${existingCommentId}`)
        .set("authorization", user_one_token)
        .send({
          text: "This is the updated content",
        })
        .expect(200);

      expect(body.data).toHaveProperty("text", "This is the updated content");
    });

    it("DELETE /comments", async () => {});
  });

  afterAll(cleanupTestEnvironment);
});
