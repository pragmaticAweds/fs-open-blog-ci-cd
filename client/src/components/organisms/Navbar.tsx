import useAuthStore from "@/entities/auth-entity";
import Button from "../atoms/Button";

const Navbar = () => {
  const username = useAuthStore().username;
  return (
    <nav className="bg-slate-600 p-4 text-white flex justify-between">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="flex items-center justify-center gap-10">
        <span className="size-6 bg-blue-700 p-6 grid place-content-center rounded-full">
          {(
            username.slice(0, 1) +
            username.slice(username.length - 1, username.length)
          ).toUpperCase()}
        </span>
        <Button label="Log In" className="px-4" />
      </div>
    </nav>
  );
};

export default Navbar;
