import express from "express";
import { format, transports } from "winston";
import cors from "cors";
import mongosanitize from "express-mongo-sanitize";
import { config } from "dotenv";
config();

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import gigsRouter from "./routes/gigs";
import reviewsRouter from "./routes/reviews";
import conversationsRouter from "./routes/conversations";
import messagesRouter from "./routes/messages";
import ordersRouter from "./routes/orders";
import paymentRouter from "./routes/payment";

import { errorHandler, notFoundHandler } from "./middlewares/catch-error";

import { logger } from "./constants/logger";

const app = express();

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(mongosanitize());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/gigs", gigsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment", paymentRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
