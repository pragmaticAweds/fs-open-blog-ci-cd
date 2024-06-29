import LoginForm from "../../components/molecules/LoginForm";

const LoginPage = () => {
  return (
    <div className="w-full h-dvh flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <img
          src="/auth.webp"
          alt="login-bg"
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-col justify-center gap-y-6 h-full w-1/2 max max-w-[35%] mx-auto">
        <>
          <h1 className="text-4xl">Welcome!</h1>
          <p className="text-gray-500 font-light mt-2">
            Please enter your Login details to sign in.
          </p>
        </>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
