import mongoose from "mongoose";
import process from "node:process";

import { DB_URI } from "../config/index.js";
import { logger } from "../constants/logger.js";

export const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI);
    logger.info(`[DB] Connected to ${connection.host}/${connection.name}`);
  } catch (error) {
    logger.error(
      `[DB] Could not connect to ${connection.host}/${connection.name} - ${error?.message}`
    );
    process.exitCode = 1;
  }
};
