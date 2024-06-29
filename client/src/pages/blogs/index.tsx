import { fetchFromApi } from "@/services";
import { useEffect, useState } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const blogDatas = await fetchFromApi({ url: "blogs" });

      console.log(blogDatas);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    return () => {};
  }, []);

  console.log(blogs);

  return <div>Blogs</div>;
};

export default Blogs;
