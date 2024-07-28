import useBlogStore from "@/entities/blog-entity";

import BlogCard from "@/components/molecules/BlogCard";

const Blogs = () => {
  const { blogs } = useBlogStore();
  // grid grid-cols-[repeat(auto-fit,minmax(18.75rem,23rem))]
  return (
    <main className="p-4 gap-8 flex flex-col w-1/2">
      {blogs
        ?.sort((a, b) => b.likes.length - a.likes.length)
        .map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
    </main>
  );
};

export default Blogs;
