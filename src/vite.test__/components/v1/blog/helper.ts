import BlogModel from "../../../../components/blog/blog.model";

const blogsInDb = async () => {
  const newBlogs = await BlogModel.find({});
  return newBlogs.map((blog) => blog.toJSON());
};

const newBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
  },
  {
    title:
      "How to setup eslint with eslint.config.mjs in your React/Typescript project eslint.config.mjs",
    author: "Abhinav Modgil",
    url: "https://medium.com/@abhinavmodgil/how-to-setup-eslint-with-eslint-config-mjs-in-your-react-typescript-project-eslint-config-mjs-31971c680f6a",
  },
  {
    title: "To Be A Great Software Developer — You Need a System",
    author: "Julie Perilla Garcia",
    url: "https://levelup.gitconnected.com/to-be-a-great-software-developer-you-need-a-system-d4f461658743",
  },
];

const createNewBlogs = async (userId?: string) => {
  for (const blog of newBlogs) {
    await new BlogModel({ ...blog, ...(userId && { User: userId }) }).save();
  }
};

export { blogsInDb, createNewBlogs, newBlogs };
