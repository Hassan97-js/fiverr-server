import express from "express";

import { createPaymentIntent } from "../controllers/payment.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";
import { createPaymentIntentValidator } from "../constants/validator.js";

const router = express.Router();

router.post(
  "/create-payment-intent",
  verifyToken,
  validate(createPaymentIntentValidator),
  createPaymentIntent
);

export default router;
