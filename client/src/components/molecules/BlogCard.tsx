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
import { deleteBlog, likeBlog } from "@/lib/actions/blog";
import { removeBlog, updateBlog } from "@/entities/blog-entity";
import useAuthStore from "@/entities/auth-entity";

const BlogCard = ({ blog }: { blog: BlogAttribute }) => {
  const userId = useAuthStore().userId;
  const [isOpen, setIsOpen] = useState(false);

  const handleBlogReading = () => setIsOpen((prev) => !prev);

  const handleBlogLike = async () => {
    try {
      const { data, status, message } = await likeBlog(blog._id);

      if (status) {
        toast(message, { type: "success" });

        updateBlog(data);

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlogDelete = async () => {
    try {
      const { status, message } = await deleteBlog(blog._id);

      if (status) {
        toast(message, { type: "success" });

        removeBlog(blog._id);

        return;
      }

      toast(message, { type: "error" });
    } catch (err) {
      console.log(err);
    }
  };

  const isBlogOwner = blog.User === userId;

  return (
    <Card key={blog._id} data-testid="blog">
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-lg">By: {blog.author}</span>
          {isBlogOwner ? (
            <Button
              label="Delete"
              className="px-4 max-w-max bg-red-800"
              data-testid="blog-delete"
              onClick={handleBlogDelete}
            />
          ) : null}
        </div>

        <div className="flex items-center">
          <span className="flex-1 font-medium" data-testid="blog-likes-count">
            Likes: {blog.likes.length}
          </span>
          <Button
            label="Like"
            className="px-4 max-w-max"
            data-testid="blog-likes"
            onClick={handleBlogLike}
          />
        </div>
        {isOpen ? (
          <>
            <div>
              Read: <a href={blog.url}>{blog.url}</a>
            </div>
          </>
        ) : null}
      </CardContent>

      <CardFooter>
        <Button label={isOpen ? "Hide" : "View"} onClick={handleBlogReading} />
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
