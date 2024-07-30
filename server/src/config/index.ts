import dotenv from "dotenv";

import { env } from "process";

dotenv.config();

const appConfig = {
  isTesting: env.NODE_ENV === "test",
  isE2ETest: env.NODE_ENV === "test-e2e",
  port: env.PORT || 3001,
  db_url: ["test", "test-e2e"].includes(env.NODE_ENV as string)
    ? env.TEST_DB_URI
    : env.DB_URI,
  authConfig: {
    jwtSecret: env.JWT_SECRET || "secret",
    saltRound: 10,
  },
};

export { appConfig };
