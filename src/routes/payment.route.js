import express from "express";

import { createPaymentIntent } from "#controllers";
import { verifyToken } from "#middlewares";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;
