import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

import { errorHandler } from "./middlewares/index.js";
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

app.use(errorHandler);

app.all("*", (req, res) => {
  return res.status(404).json({
    message: "Not Found!"
  });
});

export default app;
