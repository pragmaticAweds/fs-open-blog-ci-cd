import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/login";
import Blogs from "./pages/blogs";
import { useStore } from "./entities";

const App = () => {
  const { blogs } = useStore((state) => ({
    blogs: state.blogs,
  }));
  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />

      <LoginPage />
      <Blogs />
    </div>
  );
};

export default App;
