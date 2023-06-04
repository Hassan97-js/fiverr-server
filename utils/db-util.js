import mongoose from "mongoose";

async function connectToDB() {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log("connected");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { connectToDB };
