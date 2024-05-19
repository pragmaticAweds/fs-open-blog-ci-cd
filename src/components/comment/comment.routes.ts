import { Router } from "express";

const commentsRouter = Router();

commentsRouter.delete("/:commentId");

commentsRouter.put("/:commentId");

commentsRouter.get("/:commentId");

commentsRouter.post("/");

commentsRouter.get("/");

export default commentsRouter;
