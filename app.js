import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

import { connectToDB } from "./utils/index.js";

import {
  userRouter,
  conversationRouter,
  gigRouter,
  messageRouter,
  orderRouter,
  reviewRouter,
  authRouter
} from "./routes/index.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/gig", gigRouter);
app.use("/api/message", messageRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.listen(8800, () => {
  connectToDB();
  console.log("Server is running");
});
