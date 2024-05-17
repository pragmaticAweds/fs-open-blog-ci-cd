import express from "express";
import componentRouter from "./components/routes";
import { errorHandlerMiddleware } from "./utils/errorHandler";

const app = express();

app.use(express.json());

app.use(componentRouter);

app.use(errorHandlerMiddleware);

export default app;
