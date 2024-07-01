import { useEffect, Suspense, lazy } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/login";

import useAuthStore from "./entities/auth-entity";
import { fetchBlogs } from "./entities/blog-entity";
import Navbar from "./components/organisms/Navbar";

const LazyBlogs = lazy(() => import("./pages/blogs"));

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />

      {isLoggedIn && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        {isLoggedIn ? <LazyBlogs /> : <LoginPage />}
      </Suspense>
    </div>
  );
};

export default App;
