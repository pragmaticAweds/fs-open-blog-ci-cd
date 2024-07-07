import { createServer } from "http";

import app from "./app";

import { appConfig } from "./config";
import { closeDb } from "./config/persistence";

const { port } = appConfig;

app.set("port", port);

const activePort = app.get("port");

const server = createServer(app);

server.listen(activePort);

server.on("listening", () => {
  console.log(`Server running on port ${activePort}`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
server.on("error", (error: any) => {
  const port = activePort;
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE": {
      // generate a random port and use it
      const randomPort = +Math.random().toString().slice(2, 6);

      app.set("port", randomPort);

      console.log(`Port ${port} is already in use, trying ${randomPort}`);

      server.listen(randomPort);
      break;
    }
    default:
      throw error;
  }
});

const gracefulShutdown = () => {
  console.log("Received kill signal, shutting down gracefully.");

  server.close(async () => {
    console.log("Closed out remaining connections.");

    try {
      await closeDb();
      console.log("Closed database connections.");
    } catch (err) {
      console.log("Error closing connections", err);
    } finally {
      process.exit();
    }
  });
};

// process.on("uncaughtException", (err: Error) => {
//   handler.handleError(err);

//   if (!handler.isTrustedError(err)) process.exit(1);
// });

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
