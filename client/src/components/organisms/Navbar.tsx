import useAuthStore from "@/entities/auth-entity";
import Button from "../atoms/Button";

const Navbar = ({ openModal }: { openModal: () => void }) => {
  const { username, logOut } = useAuthStore((state) => state);

  return (
    <nav className="bg-slate-600 p-4 text-white flex justify-between">
      <h1 className="text-2xl font-semibold">Blog</h1>

      <div className="flex items-center justify-center gap-10">
        <span className="size-6 bg-blue-700 p-6 grid place-content-center rounded-full">
          {(
            username.slice(0, 1) +
            username.slice(username.length - 1, username.length)
          ).toUpperCase()}
        </span>{" "}
        <Button
          label={"Add a new blog"}
          className="px-4 whitespace-nowrap"
          onClick={openModal}
        />
        <Button label="Log Out" className="px-4" onClick={logOut} />
      </div>
    </nav>
  );
};

export default Navbar;
