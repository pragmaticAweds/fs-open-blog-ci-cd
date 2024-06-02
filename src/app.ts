import express from "express";
import helmet from "helmet";
import componentRouter from "./components/routes";
import { errorHandlerMiddleware } from "./utils/errorHandler";
import { connectDb } from "./config/persistence";
import initiateCounterModel from "./config/initiateCounterModels";
import { appConfig } from "./config";

const app = express();

const initializeDB = async () => {
  await connectDb();
  await initiateCounterModel();
};

const initializeApp = () => {
  try {
    app.use(helmet());
    app.use(express.json());

    app.use("/api", componentRouter);

    app.use(errorHandlerMiddleware);
  } catch (err) {
    throw err;
  }
};

initializeApp();

if (!appConfig.isTesting) {
  initializeDB();
}

export default app;
