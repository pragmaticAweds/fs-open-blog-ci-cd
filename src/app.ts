import express from "express";
import helmet from "helmet";
import componentRouter from "./components/routes";
import { errorHandlerMiddleware } from "./utils/errorHandler";
import { connectDb } from "./config/persistence";

const app = express();

const initializeApp = () => {
  try {
    app.use(helmet());
    app.use(express.json());

    app.use(componentRouter);

    app.use(errorHandlerMiddleware);
  } catch (err) {
    throw err;
  }
};

connectDb()
  .then((res) => initializeApp())
  .catch((err) => err);

export default app;
