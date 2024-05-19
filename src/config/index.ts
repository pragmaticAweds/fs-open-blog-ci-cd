import { env } from "process";

const appConfig = {
  port: env.PORT || 5000,
  authConfig: {
    jwtSecret: env.JWT_SECRET || "secret",
    saltRound: 10,
  },
};

export { appConfig };
