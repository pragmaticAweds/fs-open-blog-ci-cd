import { useState } from "react";
import { toast } from "react-toastify";
import { BlogAttribute } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../../@/components/ui/card";
import Button from "../atoms/Button";
import { likeBlog } from "@/lib/actions/blog";
import { updateBlog } from "@/entities/blog-entity";

const BlogCard = ({ blog }: { blog: BlogAttribute }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlogReading = () => setIsOpen((prev) => !prev);

  const handleBlogLike = async () => {
    try {
      const { data, status, message } = await likeBlog(blog._id);

      if (status) {
        toast(message, { type: "success" });

        updateBlog(data);

        console.log(data);

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card key={blog._id} className="blog">
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <span className="font-medium text-lg">By: {blog.author}</span>

        {isOpen ? (
          <div className="flex items-center">
            <span className="flex-1 font-medium">
              Likes: {blog.likes.length}
            </span>{" "}
            <span
              className="border py-1 px-4 cursor-pointer border-gray-400"
              onClick={handleBlogLike}
            >
              Like
            </span>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-x-2">
        <Button label={isOpen ? "Hide" : "View"} onClick={handleBlogReading} />
        <a href={blog.url} className="text-center border border-black py-3">
          Read
        </a>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
