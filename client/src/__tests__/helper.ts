import { baseUrl } from "@/lib/config/constant";
import { request } from "@playwright/test";

const apiContext = await request.newContext({
  baseURL: baseUrl,
  extraHTTPHeaders: {
    origin: "http://localhost:5174",
  },
});

const userData = [
  {
    name: "aweds",
    username: "aweds",
    password: "Aweds.1234",
    is_creator: false,
  },
  {
    name: "john",
    username: "john wales",
    password: "Aweds.1234",
    is_creator: true,
  },
];

const blogData = {
  author: "Colby Fayocks",
  title: "How to detect clicks anywhere on a page in React.",
  wrongUrl: "google.123",
  url: "https://spacejelly.dev/posts/how-to-detect-clicks-anywhere-on-a-page-in-react",
};

const blogsData = [
  {
    author: "Colby Fayocks",
    title: "How to build a notification system in NextJs",
    url: "https://spacejelly.dev/posts/how-to-build-a-notification-system-in-next-js-with-knock",
  },
  {
    author: "Colby Fayocks",
    title: "How to create a twitch chat bot",
    url: "https://spacejelly.dev/posts/how-to-create-a-twitch-chat-bot-with-node-js-tmi-js-heroku",
  },
];

export { apiContext, userData, blogData, blogsData };
