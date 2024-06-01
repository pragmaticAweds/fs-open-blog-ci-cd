import BlogModel from "../../../../components/blog/blog.model";

const blogs = [];

const defaultLikes = (obj) =>
  !obj.hasOwnProperty("likes") ? { ...obj, likes: 0 } : obj;

const nonExistingLikes = async () => {
  const receivedBlogs = await BlogModel.find({});
  return receivedBlogs.map((blog) => {
    // if (!blog.hasOwnProperty("likes")) return { ...blog, likes: 0 };
    return blog.toJSON();
  });
};

const blogsInDb = async () => {
  const newBlogs = await BlogModel.find({});
  return newBlogs.map((blog) => blog.toJSON());
};

export { blogs, nonExistingLikes, defaultLikes, blogsInDb };
