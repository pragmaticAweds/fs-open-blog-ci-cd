import { ZodError, z } from "zod";

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

export { validateSchema };
