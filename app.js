import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

const whitelist = ["http://localhost:5173", "https://myfiverrclone.netlify.app"];

app.use(
  cors({
    origin(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(cookieParser());
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
