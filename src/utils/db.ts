import mongoose from "mongoose";
import process from "node:process";

import { DB_URI } from "../config";
import { logger } from "../constants/logger";

export const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI!);
    logger.info(`[DB] Connected to ${connection.host}/${connection.name}`);
  } catch (error) {
    logger.error("[DB] Could not connect to database");
    process.exitCode = 1;
  }
};
