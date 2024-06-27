import LoginForm from "../../components/molecules/LoginForm";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-center w-full gap-y-6 max-w-[70%] mx-auto">
        <div>
          <h1 className="text-4xl">Welcome!</h1>
          <p className="text-gray-500 font-light mt-2">
            Please enter your Login details to sign in.
          </p>
        </div>

        <LoginForm />
      </div>
      <div className="relative">
        <img
          src="/login-bg.jpg"
          alt="login-bg"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </div>
  );
};

export default LoginPage;
