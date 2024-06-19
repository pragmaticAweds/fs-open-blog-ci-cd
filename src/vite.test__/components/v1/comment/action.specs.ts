import { afterAll, beforeAll, describe, it } from "vitest";
import { Model } from "mongoose";
import supertest from "supertest";

import BlogModel from "../../../../components/blog/blog.model";
import CommentModel from "../../../../components/comment/comment.model";
import { newCreatorDetails } from "../../../testDatas";
import { createNewUsers } from "../user/helper";
import app from "../../../../app";
import UserModel from "../../../../components/user/user.model";
import UserAccessModel from "../../../../components/auth/auth.model";

const api = supertest(app);

const collections = [
  UserModel,
  UserAccessModel,
  BlogModel,
  CommentModel,
] as unknown as Model<unknown>[];

// beforeAll(async () => {});
// afterAll(async () => {});

describe("Add Comment to a blog", () => {
  let user_one_token = "",
    existingDocId = "",
    blog = null;

  const [creator_one] = newCreatorDetails;

  beforeAll(async () => {
    await UserModel.deleteMany();
    await UserAccessModel.deleteMany();
    // await Promise.all([, ]);

    await createNewUsers(0, 1);

    const { username, password } = creator_one;

    const { body } = await api
      .post("/api/auth/login")
      .send({ username, password });

    console.log(JSON.stringify({ body }, null, 2));

    user_one_token = `Bearer ${body.data.token}`;
  });

  afterAll(async () => {
    console.log("Connection closed");
    // await mongoose.connection.close();
  });
  it("POST /comments", async () => {});

  it("EDIT /comments", async () => {});

  it("DELETE /comments", async () => {});
});
