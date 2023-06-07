import express from "express";
import cors from "cors";
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

import { notFoundHandler } from "./utils/index.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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

app.all("*", notFoundHandler);

export default app;
