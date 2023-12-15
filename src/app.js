import express from "express";
import cors from "cors";
import mongosanitize from "express-mongo-sanitize";
import { config } from "dotenv";
config();

import userRouter from "./routes/user.js";
import conversationsRouter from "./routes/conversations.js";
import gigsRouter from "./routes/gigs.js";
import messagesRouter from "./routes/messages.js";
import ordersRouter from "./routes/orders.js";
import reviewsRouter from "./routes/reviews.js";
import authRouter from "./routes/auth.js";
import paymentRouter from "./routes/payment.js";

import { errorHandler, notFoundHandler } from "./middlewares/catch-error.js";

const app = express();

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
app.use("/api/orders", ordersRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/payment", paymentRouter);

app.use("*", notFoundHandler);
app.use("*", errorHandler);

export default app;
