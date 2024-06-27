import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});
