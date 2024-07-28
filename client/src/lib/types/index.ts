type methodTypes = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type responseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

interface fetchApiAttributes {
  url: string;
  method?: methodTypes;
  data?: Record<string, unknown> | RequestInit["body"];
  reqConfig?: RequestInit;
}

type BlogAttribute = {
  _id: string;
  title: string;
  author: string;
  url: string;
  likes: string[];
  User: unknown;
  ref: number;
};

type BlogEntityAttribute = {
  blogs: BlogAttribute[];
  addBlog: (blog: BlogAttribute) => void;
  updateBlog: (blog: BlogAttribute) => void;
  setBlog: (blogs: BlogAttribute[]) => void;
};

interface AuthAttribute {
  token: string | null;
  isLoggedIn: boolean;
  username: string;
  userId: string;
  setAuth: (authData: AuthAttribute) => void;
  logOut: () => void;
}

export type {
  methodTypes,
  responseType,
  fetchApiAttributes,
  BlogAttribute,
  BlogEntityAttribute,
  AuthAttribute,
};
