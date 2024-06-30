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
    <main className="flex justify-around">
      {blogs.map((blog) => (
        <Card key={blog._id}>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
};

export default Blogs;
