import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

import { errorHandler } from "./middlewares/index.js";
import {
  usersRouter,
  conversationsRouter,
  gigsRouter,
  messagesRouter,
  ordersRouter,
  reviewsRouter,
  authRouter
} from "./routes/index.js";

const app = express();
const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsConfig));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/gigs", gigsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);

app.use(errorHandler);

export default app;
