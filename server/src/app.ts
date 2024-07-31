import express, { NextFunction, Response } from "express";
import helmet from "helmet";
import cors from "cors";

import componentRouter from "./components/routes";
import {
  ResponseError,
  errorHandlerMiddleware,
  handleErrorResponse,
} from "./utils/errorHandler";
import { connectDb } from "./config/persistence";

import { initiateCounterModel } from "./config/initiateCounterModels";
import { appConfig } from "./config";
import { IRequest } from "./types";
import path from "path";

const app = express();

const initializeDB = async () => {
  await connectDb();
  await initiateCounterModel();
};

const allowedOrigin = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
];

const corsOption = {
  origin: function (
    origin: string | undefined,
    callback: (_err: Error | null, _origin?: boolean) => void
  ) {
    if (
      !origin ||
      appConfig.isTesting ||
      appConfig.isE2ETest ||
      allowedOrigin.indexOf(origin as string) !== -1
    ) {
      callback(null, true);
    } else {
      callback(
        new ResponseError({ message: "Not allowed by CORS", status: 403 })
      );
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const initializeApp = () => {
  app.use(helmet());
  app.use(cors(corsOption));
  app.use(express.json());

  app.use("/api", componentRouter);

  app.use(express.static("dist-2"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist-2/index.html"));
  });

  app.use((err: unknown, req: IRequest, res: Response, next: NextFunction) => {
    try {
      handleErrorResponse(err);
    } catch (handledError) {
      if (handledError instanceof ResponseError) {
        errorHandlerMiddleware(handledError, req, res, next);
      } else {
        const genericError = new ResponseError({
          message: "An unexpected error occurred",
          status: 500,
        });

        errorHandlerMiddleware(genericError, req, res, next);
      }
    }
  });
};

if (!appConfig.isTesting) initializeDB();

initializeApp();

export default app;
