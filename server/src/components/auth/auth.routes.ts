import { Router } from "express";
import { policyMiddleware } from "../../utils";
import { doLoginSchema, doSignupSchema } from "./auth.policy";
import { doLogin, doSignup } from "./auth.actions";

const authsRouter = Router();

authsRouter.post("/signup", policyMiddleware(doSignupSchema), doSignup);

authsRouter.post("/login", policyMiddleware(doLoginSchema), doLogin);

export default authsRouter;
