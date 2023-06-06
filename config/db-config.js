import mongoose from "mongoose";

async function connectToDB() {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.info("[db]: Connected");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { connectToDB };
