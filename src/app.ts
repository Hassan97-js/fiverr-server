import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import { format, transports } from "winston";
import cors from "cors";
import mongosanitize from "express-mongo-sanitize";
import { config } from "dotenv";
config();

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import gigsRouter from "./routes/gigs";
import reviewsRouter from "./routes/reviews";
import chatsRouter from "./routes/chats";
import chatMessagesRouter from "./routes/chat-messages";
import ordersRouter from "./routes/orders";
import paymentRouter from "./routes/payment";

import { errorHandler, notFoundHandler } from "./middlewares/catch-error";

import { logger } from "./constants/logger";

const app = express();

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(mongosanitize());
app.use(express.json());

app.get("/", (_req, res) => {
  res.redirect("/api/gigs");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/gigs", gigsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/chat-messages", chatMessagesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment", paymentRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
