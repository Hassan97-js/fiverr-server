import process from "node:process";

import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URI);
    console.info(`[db]: Connected to ${connection.host}/${connection.name}`);
  } catch (error) {
    console.error("Could not connect to DB");
    process.exitCode = 1;
  }
};
