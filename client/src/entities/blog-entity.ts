import { StateCreator } from "zustand";

import { BlogEntityAttribute } from "@/lib/types";

export const createBlogEntity: StateCreator<
  BlogEntityAttribute,
  [["zustand/immer", never]],
  [],
  BlogEntityAttribute
> = (set) => ({
  blogs: [],
  addBlog: (blog) =>
    set((state) => {
      state.blogs.push(blog);
    }),
  setBlog: (blogs) =>
    set((state) => {
      state.blogs = blogs;
    }),
});
