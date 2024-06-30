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

const fetchBlogs = async () => {
  const { data } = await fetchFromApi({ url: "blogs" });

  return useBlogStore.setState((state) => ({
    ...state,
    blogs: data,
  }));
};

export { addBlog, fetchBlogs };

export default useBlogStore;
