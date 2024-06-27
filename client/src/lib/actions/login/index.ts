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
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const { message, token } = await res.json();

    localStorage.setItem("token", token);

    // cookies().set("session", token, { expires: Date.now() - 60 * 1000 });

    return {
      isAuthenticated: res.ok,
      message,
      token,
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      message: (err as { message: string }).message,
    };
  }
};
