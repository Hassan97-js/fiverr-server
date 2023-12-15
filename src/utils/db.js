import mongoose from "mongoose";
import process from "node:process";

import { DB_URI } from "../config/index.js";

export const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI);
    console.info(`[db]: Connected to ${connection.host}/${connection.name}`);
  } catch (error) {
    console.error("Could not connect to DB");
    process.exitCode = 1;
  }
};
