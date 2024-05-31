import { beforeAll, beforeEach, describe, it } from "vitest";
import supertest from "supertest";

import { connectDb } from "../../../../config/persistence";
import app from "../../../../app";
import BlogModel, {
  BlogCounterModel,
} from "../../../../components/blog/blog.model";
import UserModel, {
  UserCounterModel,
} from "../../../../components/user/user.model";
import { removeDbCollections } from "../../../testHelpers";
import { Model } from "mongoose";

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
});

describe("Validate Auth Actions", () => {
  it("User signed up successfully", ({ expect }) => {});
});
