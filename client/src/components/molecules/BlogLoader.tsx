import Skeleton from "../atoms/Skeleton";

const BlogLoader = () => {
  const skeletonLength = Array.from({ length: 5 });
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] p-4 gap-8">
      {skeletonLength.map((_skeleton, i) => (
        <div key={"skeleton-blog-loader" + i} className="space-y-3">
          <Skeleton className="h-48  rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogLoader;
