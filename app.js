import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

import {
  userRouter,
  conversationRouter,
  gigRouter,
  messageRouter,
  orderRouter,
  reviewRouter,
  authRouter
} from "./routes/index.js";

import { connectToDB, createNewError } from "./utils/index.js";

const app = express();

const PORT = 5500;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/gig", gigRouter);
app.use("/api/message", messageRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.use((error, _req, res) => {
  const middlewareError = createNewError(error.status, error.message);

  return res.status(errorStatus).send({
    message: middlewareError.message,
    statusCode: middlewareError.statusCode
  });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`[server]: Running on port http://localhost:${PORT}`);
});
