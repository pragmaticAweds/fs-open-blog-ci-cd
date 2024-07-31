import { policyMiddleware } from "../../utils";
import { doLoginSchema, doSignupSchema } from "./auth.policy";
import { doLogin, doSignup } from "./auth.actions";
import { EnhancedRouter } from "../../utils/routesErrorHandler";

const authsRouter = new EnhancedRouter();

authsRouter.post("/signup", policyMiddleware(doSignupSchema), doSignup);

authsRouter.post("/login", policyMiddleware(doLoginSchema), doLogin);

export default authsRouter.getRouter();
