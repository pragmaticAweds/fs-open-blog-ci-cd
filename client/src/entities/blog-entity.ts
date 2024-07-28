import { create } from "zustand";

import { BlogAttribute, BlogEntityAttribute } from "@/lib/types";
import { fetchFromApi } from "@/services";

const useBlogStore = create<Pick<BlogEntityAttribute, "blogs">>(() => ({
  blogs: [],
}));

const addBlog = (blog: BlogAttribute) =>
  useBlogStore.setState((state) => ({
    ...state,
    blogs: [...state.blogs, blog],
  }));

const updateBlog = (updatedBlog: BlogAttribute) =>
  useBlogStore.setState((state) => ({
    ...state,
    blogs: state.blogs.map((blog) =>
      blog._id === updatedBlog._id ? updatedBlog : blog
    ),
  }));

const removeBlog = (blogId: BlogAttribute["_id"]) =>
  useBlogStore.setState((state) => ({
    ...state,
    blogs: state.blogs.filter((blog) => blog._id !== blogId),
  }));

const fetchBlogs = async () => {
  const { data } = await fetchFromApi({ url: "blogs" });

  return useBlogStore.setState((state) => ({
    ...state,
    blogs: data,
  }));
};

export { addBlog, fetchBlogs, updateBlog, removeBlog };

export default useBlogStore;
