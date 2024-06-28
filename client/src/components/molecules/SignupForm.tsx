import { FormEvent } from "react";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doLogin } from "../../lib/actions/login";

const SignupForm = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { currentTarget } = e;

    const formData = new FormData(currentTarget);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const { isAuthenticated, message } = await doLogin({
        username,
        password,
      });

      if (isAuthenticated) {
        toast(message, { type: "success" });

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
      <ToastContainer position="top-right" autoClose={700} />

      <form className="flex flex-col w-full gap-y-12" onSubmit={handleSubmit}>
        <Input label="Name" isRequired name="name" />
        <Input label="Username" isRequired name="username" />
        <Input label="Creator" isRequired name="is_creator" type="radio" />
        <Input label="Password" type="password" isRequired name="password" />

        <Button label="Login" />
      </form>
    </>
  );
};

export default SignupForm;
