import { z } from "zod";
import { validatePassword } from "../../utils";

const doSignupSchema = z.object({
  name: z.string().trim().toLowerCase(),
  username: z.string().trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .refine(
      validatePassword,
      "Password must contain password must contain: number, capital letter and symbol"
    ),
});
