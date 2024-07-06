import { useEffect, Suspense, lazy, useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/login";

import useAuthStore from "./entities/auth-entity";
import { fetchBlogs } from "./entities/blog-entity";
import Navbar from "./components/organisms/Navbar";
import Modal from "./components/molecules/Modal";
import AddBlogForm from "./components/molecules/AddBlogForm";
import BlogLoader from "./components/molecules/BlogLoader";

const LazyBlogs = lazy(() => import("./pages/blogs"));

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={500} />

      <Modal closeModal={closeModal} isOpen={isModalOpen}>
        <AddBlogForm closeModal={closeModal} />
      </Modal>
      {isLoggedIn && <Navbar openModal={openModal} />}
      <Suspense fallback={<BlogLoader />}>
        {isLoggedIn ? <LazyBlogs /> : <LoginPage />}
      </Suspense>
    </div>
  );
};

export default App;
