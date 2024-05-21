import dotenv from "dotenv";

import { env } from "process";

dotenv.config();

const appConfig = {
  port: env.PORT || 5000,
  db_url: env.DB_URL || "",
  authConfig: {
    jwtSecret: env.JWT_SECRET || "secret",
    saltRound: 10,
  },
};

export { appConfig };
