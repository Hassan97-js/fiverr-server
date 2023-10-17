import express from "express";

import { createPaymentIntent } from "../controllers/index.js";
import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;
