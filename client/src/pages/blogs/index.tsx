import useBlogStore from "@/entities/blog-entity";

import BlogCard from "@/components/molecules/BlogCard";

const Blogs = () => {
  const { blogs } = useBlogStore();

  return (
    <main className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,23rem))] p-4 gap-8">
      {blogs?.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </main>
  );
};

export default Blogs;
