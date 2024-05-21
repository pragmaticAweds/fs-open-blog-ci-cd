import { createServer } from "http";

import app from "./app";

import { appConfig } from "./config";

const { port } = appConfig;

app.set("port", port);

const activePort = app.get("port");

const server = createServer(app);

server.listen(activePort);

server.on("listening", () => {
  console.log(`Server running on port ${activePort}`);
});

server.on("error", (error: any) => {
  const port = activePort;
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      // generate a random port and use it
      const randomPort = +Math.random().toString().slice(2, 6);
      app.set("port", randomPort);

      console.log(`Port ${port} is already in use, trying ${randomPort}`);

      server.listen(randomPort);
      // console.error(`${bind} is already in use`);
      break;
    default:
      throw error;
  }
});
