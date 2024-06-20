import { Model, connection } from "mongoose";
import { ZodError, z } from "zod";
import { closeDb, connectDb } from "../config/persistence";
import {
  initiateCounterModel,
  removeCounterModel,
} from "../config/initiateCounterModels";
import CommentModel from "../components/comment/comment.model";

import UserAccessModel from "../components/auth/auth.model";
import BlogModel from "../components/blog/blog.model";
import UserModel from "../components/user/user.model";

const validateSchema = <T>(schema: z.Schema<T>, data: unknown) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors[0].message,
        path: error.errors[0].path[0],
      };
    }
  }
};

const removeDbCollections = async (collections: Model<unknown>[]) => {
  try {
    await Promise.all(collections.map(async (Model) => Model.deleteMany()));

    console.log("Db cleared");
  } catch (err) {}
};

const initializeTestEnvironment = async () => {
  await connectDb();
  await initiateCounterModel();
};

const cleanupTestEnvironment = async () => {
  await removeCounterModel();
  // await connection.close();
};

export {
  validateSchema,
  removeDbCollections,
  initializeTestEnvironment,
  cleanupTestEnvironment,
};
