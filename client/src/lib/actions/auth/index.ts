import { fetchFromApi } from "@/services";
import { loginFormSchema } from "./policy";
import { z } from "zod";

export const doLogin = async (data: z.infer<typeof loginFormSchema>) => {
  const validatedFields = loginFormSchema.safeParse(data);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input fields.",
    };

  try {
    const { status, message, data } = await fetchFromApi({
      url: "auth/login",
      method: "post",
      data: validatedFields.data,
    });

    if (!status) {
      return {
        isAuthenticated: false,
        message: message,
      };
    }

    return {
      isAuthenticated: status,
      message,
      data,
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      message: (err as { message: string }).message,
    };
  }
};
