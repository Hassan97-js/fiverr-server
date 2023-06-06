import process from "node:process";

import mongoose from "mongoose";

async function connectToDB() {
  try {
    const { connection } = await mongoose.connect(process.env.CONNECTION);
    console.info("[db]: Connected:", connection.host, connection.name);
  } catch (error) {
    console.error("Could not connect to DB");
    process.exitCode = 1;
  }
}

export { connectToDB };
