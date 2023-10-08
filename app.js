import express from "express";
import cors from "cors";
import cookie from "cookie";
import mongosanitize from "express-mongo-sanitize";
import { config } from "dotenv";
config();

import { errorHandler, notFoundHandler } from "./middlewares/index.js";

import {
  userRouter,
  conversationsRouter,
  gigsRouter,
  messagesRouter,
  ordersRouter,
  reviewsRouter,
  authRouter,
  paymentRouter
} from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// cookie middleware
app.use((req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || "");

  req.headers.cookie = cookies;

  next();
});

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

app.use("/api/*", notFoundHandler);

app.use(errorHandler);

export default app;
