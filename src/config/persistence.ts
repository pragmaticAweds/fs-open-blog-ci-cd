import mongoose from "mongoose";
import { appConfig } from ".";
import { handleErrorResponse } from "../utils/errorHandler";

const connectDb = async () => {
  try {
    mongoose.set("debug", {
      color: true,
    });

    await mongoose.connect(appConfig.db_url as string, {
      family: 4,
    });

    console.log("Database connection successful.");
  } catch (err) {
    console.log(err);
    handleErrorResponse(err);
  }
};

const closeDb = async () => {
  try {
    await mongoose.disconnect();

    console.log("Connection closed successfully");
  } catch (err) {
    handleErrorResponse(err);
  }
};

// const closeDbConnection = async () => {
//   try {
//     await mongoose.connection.close();

//     console.log("Connection closed successfully");
//   } catch (err) {
//     handleErrorResponse(err);
//   }
// };

export { connectDb, closeDb };
