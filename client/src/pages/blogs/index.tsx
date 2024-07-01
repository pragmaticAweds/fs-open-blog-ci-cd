import useBlogStore from "@/entities/blog-entity";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";

const Blogs = () => {
  const { blogs } = useBlogStore();

  return (
    <main className="grid grid-cols-4 p-4 gap-16">
      {blogs.map((blog) => (
        <Card key={blog._id} className="w-full">
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <a href={blog.url}>{blog.url}</a>
          </CardContent>

          <CardFooter>
            <p>{blog._id}</p>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
};

export default Blogs;
