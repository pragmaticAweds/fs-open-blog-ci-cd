import supertest from "supertest";

import { connectDb } from "../../../../config/persistence";
import app from "../../../../app";

import UserModel, {
  UserCounterModel,
} from "../../../../components/user/user.model";
import {
  cleanupTestEnvironment,
  removeDbCollections,
} from "../../../testHelpers";
import { Model } from "mongoose";
import UserAccessModel, {
  UserAccessCounterModel,
} from "../../../../components/auth/auth.model";
import { initiateCounterModel } from "../../../../config/initiateCounterModels";
import { newCreatorDetails } from "../../../testDatas";
import { usersInDb } from "./helpers";

const api = supertest(app);

const collections = [UserModel, UserAccessModel] as unknown as Model<unknown>[];

describe("Auth Test", () => {
  beforeAll(async () => {
    await connectDb();
    await initiateCounterModel([UserCounterModel, UserAccessCounterModel]);
  });

  const [test_data_one, test_data_two, test_data_three] = newCreatorDetails;

  describe("Post /auth/signup", () => {
    it("should return 201 for new user", async () => {
      const { body } = await api
        .post("/api/auth/signup")
        .send(test_data_one)
        .expect(201);

      const [users, userAccess] = await usersInDb();

      expect(body.data.username).toBe(test_data_one.username);

      expect(users[0]._id).toBe(userAccess[0].User);

      expect(users.length).toStrictEqual(userAccess.length);
    });

    it("should return 409 for existing user", async () => {
      await api.post("/api/auth/signup").send(test_data_one).expect(409);
    });
  });

  describe("Login /auth/login", () => {
    it("should return 400 for non existing user", async () => {
      await api.post("/api/auth/login").send(test_data_two).expect(400);
    });

    it("should return 200 for existing user", async () => {
      const { body } = await api
        .post("/api/auth/login")
        .send(test_data_one)
        .expect(200);

      expect(body.data.username).toBe(test_data_one.username);
    });

    it("should return 400 for existing user with no userAccess", async () => {
      await new UserModel(test_data_three).save();

      await api.post("/api/auth/login").send(test_data_three).expect(400);
    });
  });

  afterAll(async () => {
    await removeDbCollections(collections);
    await cleanupTestEnvironment();
  });
});
