import dotenv from "dotenv";

import { env } from "process";

dotenv.config();

console.log(env.PORT);

const appConfig = {
  isTesting: env.NODE_ENV === "test",
  port: env.PORT || 5000,
  db_url: env.NODE_ENV === "test" ? env.TEST_DB_URI : env.DB_URI,
  authConfig: {
    jwtSecret: env.JWT_SECRET || "secret",
    saltRound: 10,
  },
};

export { appConfig };
