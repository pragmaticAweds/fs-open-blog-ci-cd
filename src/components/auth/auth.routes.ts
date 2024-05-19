import { Router } from "express";

const authsRouter = Router();

authsRouter.post("/login");

authsRouter.post("/signup");

export default authsRouter;
