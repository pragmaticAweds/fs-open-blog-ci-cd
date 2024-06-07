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
import { removeDbCollections } from "../../../testHelpers";
import UserAccessModel from "../../../../components/auth/auth.model";
import { creatorLoginDetails, newCreatorDetails } from "../../../testDatas";

const api = supertest(app);

beforeAll(async () => {
  await connectDb();
  await initiateCounterModel();
});

afterAll(async () => {
  await removeCounterModel();
  await closeDb();
});

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

// describe("Creating new blog", () => {
//   let headers = "";

//   const newBlog = newBlogs[1];

//   const collections = [
//     UserModel,
//     UserAccessModel,
//     BlogModel,
//   ] as unknown as Model<unknown>[];

//   beforeAll(async () => {
//     await api.post("/api/auth/signup").send(newUser);

//     const { body } = await api.post("/api/auth/login").send(loginUser);

//     headers = `Bearer ${body.data.token}`;
//   });

//   afterAll(async () => {
//     await removeDbCollections(collections);
//   });

//   test("verify new blog is created successfully", async ({ expect }) => {
//     const { body } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog)
//       .expect(201)
//       .expect("Content-Type", /application\/json/);

//     const blogs = await blogsInDb();

//     expect(blogs.length).toEqual(1);

//     expect(body.data.title).toEqual(newBlog.title);
//     expect(body.data.author).toEqual(newBlog.author);

//     assert.strictEqual(body.data.url, newBlog.url);
//   });

//   test("Only authorized personnel can create blog", async ({ expect }) => {
//     await api.post("/api/blogs").send(newBlog).expect(401);
//   });

//   test("ref and _id field is equal to last document count", async () => {
//     const {
//       body: { data },
//     } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog);

//     const blogTracker = await BlogCounterModel.findOne();

//     const lastBlogId = blogTracker?.lastId;

//     assert.strictEqual(data.ref, lastBlogId);

//     assert.isTrue(data._id.endsWith(String(lastBlogId)));
//   });

//   test("Incomplete blog info returns 400 Bad Request", async ({ expect }) => {
//     const { title, author, url } = newBlog;

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ title, author })
//       .expect(400);

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ url, author })
//       .expect(400);

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ url, title })
//       .expect(400);
//   });

//   test("Verify Likes should be empty array by default", async ({ expect }) => {
//     const { body } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog);

//     const blog = body.data;

//     expect(blog).toHaveProperty("likes");

//     assert.deepEqual(blog.likes, []);
//   });
// });

// describe("Edit existing blog", () => {
//   let headers = "";

//   const newBlog = newBlogs[1];

//   const collections = [
//     UserModel,
//     UserAccessModel,
//     BlogModel,
//   ] as unknown as Model<unknown>[];

//   const newUser = {
//     username: "john_doe",
//     password: "John.Doe1",
//     name: "john doe",
//     is_creator: true,
//   };

//   test("verify new blog is created successfully", async ({ expect }) => {
//     const { body } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog)
//       .expect(201)
//       .expect("Content-Type", /application\/json/);

//     const blogs = await blogsInDb();

//     expect(blogs.length).toEqual(1);

//     expect(body.data.title).toEqual(newBlog.title);
//     expect(body.data.author).toEqual(newBlog.author);

//     assert.strictEqual(body.data.url, newBlog.url);
//   });

//   test("Only authorized personnel can create blog", async ({ expect }) => {
//     await api.post("/api/blogs").send(newBlog).expect(401);
//   });

//   test("ref and _id field is equal to last document count", async () => {
//     const {
//       body: { data },
//     } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog);

//     const blogTracker = await BlogCounterModel.findOne();

//     const lastBlogId = blogTracker?.lastId;

//     assert.strictEqual(data.ref, lastBlogId);

//     assert.isTrue(data._id.endsWith(String(lastBlogId)));
//   });

//   test("Incomplete blog info returns 400 Bad Request", async ({ expect }) => {
//     const { title, author, url } = newBlog;

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ title, author })
//       .expect(400);

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ url, author })
//       .expect(400);

//     await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send({ url, title })
//       .expect(400);
//   });

//   test("Verify Likes should be empty array by default", async ({ expect }) => {
//     const { body } = await api
//       .post("/api/blogs")
//       .set("authorization", headers)
//       .send(newBlog);

//     const blog = body.data;

//     expect(blog).toHaveProperty("likes");

//     assert.deepEqual(blog.likes, []);
//   });
// });

describe("Blog API", () => {
  let headers = "";

  const newBlog = newBlogs[1];

  const collections = [
    UserModel,
    UserAccessModel,
    BlogModel,
  ] as unknown as Model<unknown>[];

  beforeAll(async () => {
    await api.post("/api/auth/signup").send(newCreatorDetails);

    const { body } = await api
      .post("/api/auth/login")
      .send(creatorLoginDetails);

    headers = `Bearer ${body.data.token}`;
  });

  afterAll(async () => {
    await removeDbCollections(collections);
  });

  describe("POST /blogs", () => {
    test("should add a new blog successfully", async ({ expect }) => {
      const { body } = await api
        .post("/api/blogs")
        .set("authorization", headers)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await blogsInDb();

      expect(blogs.length).toEqual(1);
      expect(body.data.title).toEqual(newBlog.title);
      expect(body.data.author).toEqual(newBlog.author);
      assert.strictEqual(body.data.url, newBlog.url);
    });
  });
});
