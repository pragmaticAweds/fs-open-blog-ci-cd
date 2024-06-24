import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/:userId");

usersRouter.get("/");

export default usersRouter;
