import { z } from "zod";
import { validatePassword } from "../../utils/validators";

const doSignupSchema = z.object({
  name: z.string().trim().toLowerCase(),
  username: z.string().trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, "length should be 8 or higher")
    .refine(
      validatePassword,
      "must contain: number, capital letter and symbol."
    ),
  is_creator: z.boolean(),
});

const doLoginSchema = z.object({
  username: z.string().trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, "length should be 8 or higher")
    .refine(
      validatePassword,
      "must contain: number, capital letter and symbol."
    ),
});

export { doSignupSchema, doLoginSchema };
