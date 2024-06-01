import { Document, Model } from "mongoose";
import { ZodError, z } from "zod";
import { CustomIdAttributes } from "../types";

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

export { validateSchema, removeDbCollections };