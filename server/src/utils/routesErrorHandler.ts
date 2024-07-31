import {
  NextFunction,
  Request,
  Response,
  Router,
  RequestHandler,
  IRouterMatcher,
} from "express";

class EnhancedRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  private wrapHandler(handler: RequestHandler): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  private createMethod(method: keyof Router) {
    return (path: string, ...handlers: RequestHandler[]) => {
      const wrappedHandlers = handlers.map((handler) =>
        this.wrapHandler(handler)
      );
      (this.router[method] as IRouterMatcher<Router>)(path, ...wrappedHandlers);
    };
  }

  get = this.createMethod("get");
  post = this.createMethod("post");
  put = this.createMethod("put");
  delete = this.createMethod("delete");
  patch = this.createMethod("patch");
  options = this.createMethod("options");
  head = this.createMethod("head");

  all(path: string, ...handlers: RequestHandler[]) {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler)
    );

    this.router.all(path, ...wrappedHandlers);
  }

  use(...handlers: RequestHandler[]) {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler)
    );

    this.router.use(...wrappedHandlers);
  }

  getRouter() {
    return this.router;
  }
}

export { EnhancedRouter };
