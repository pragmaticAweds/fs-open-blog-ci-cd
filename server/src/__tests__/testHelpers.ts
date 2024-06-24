import { Model } from "mongoose";
import { ZodError, z } from "zod";
import { closeDb, connectDb } from "../config/persistence";
import {
  initiateCounterModel,
  removeCounterModel,
} from "../config/initiateCounterModels";

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
  } catch (err) {
    throw new Error(err as string);
  }
};

const initializeTestEnvironment = async () => {
  await connectDb();
  console.log("Initiating Counter");
  await initiateCounterModel();
};

const cleanupTestEnvironment = async () => {
  await removeCounterModel();
  await closeDb();
};

export {
  validateSchema,
  removeDbCollections,
  initializeTestEnvironment,
  cleanupTestEnvironment,
};
