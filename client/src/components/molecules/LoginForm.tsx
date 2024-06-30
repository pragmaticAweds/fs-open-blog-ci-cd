import { FormEvent } from "react";
import { toast } from "react-toastify";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { doLogin } from "../../lib/actions/auth";
import useAuthStore from "@/entities/auth-entity";

const LoginForm = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { currentTarget } = e;

    const formData = new FormData(currentTarget);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const { isAuthenticated, message, data } = await doLogin({
        username,
        password,
      });

      if (isAuthenticated) {
        toast(message, { type: "success" });

        setAuth({ ...data, isLoggedIn: true });

        //clear each input field

        ["username", "password"].forEach(
          (field) => (currentTarget[field]["value"] = "")
        );

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="flex flex-col w-full gap-y-12" onSubmit={handleSubmit}>
        <Input label="Username" isRequired name="username" />

        <Input label="Password" type="password" isRequired name="password" />

        <Button label="Login" />
      </form>
    </>
  );
};

export default LoginForm;
