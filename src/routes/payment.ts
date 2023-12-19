import express from "express";

import { createPaymentIntent } from "../controllers/payment";

import { verifyToken } from "../middlewares/verify";
import { validate } from "../middlewares/validate";
import { createPaymentIntentValidator } from "../constants/validator";

const router = express.Router();

router.post(
  "/create-payment-intent",
  verifyToken,
  validate(createPaymentIntentValidator),
  createPaymentIntent
);

export default router;
