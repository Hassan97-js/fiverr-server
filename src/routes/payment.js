import express from "express";

import { verifyToken } from "../middlewares/verify.js";
import { createPaymentIntent } from "../controllers/payment.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;
