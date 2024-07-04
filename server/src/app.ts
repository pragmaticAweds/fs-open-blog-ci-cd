import express from "express";
import helmet from "helmet";
import cors from "cors";

import componentRouter from "./components/routes";
import { ResponseError, errorHandlerMiddleware } from "./utils/errorHandler";
import { connectDb } from "./config/persistence";

import { initiateCounterModel } from "./config/initiateCounterModels";
import { appConfig } from "./config";

const app = express();

const initializeDB = async () => {
  await connectDb();
  await initiateCounterModel();
};

const allowedOrigin = ["http://localhost:5173", "http://localhost:5174"];
const corsOption = {
  origin: function (
    origin: string | undefined,
    callback: (_err: Error | null, _origin?: boolean) => void
  ) {
    if (allowedOrigin.indexOf(origin as string) !== -1) {
      callback(null, true);
    } else {
      callback(
        new ResponseError({ message: "Not allowed by CORS", status: 403 })
      );
    }
  },
  credentials: true,
};

const initializeApp = () => {
  try {
    app.use(cors(corsOption));
    app.use(helmet());
    app.use(express.json());

    app.use("/api", componentRouter);

    app.use(errorHandlerMiddleware);
  } catch (err) {
    throw new Error(err as string);
  }
};

if (!appConfig.isTesting) initializeDB();
initializeApp();

export default app;
