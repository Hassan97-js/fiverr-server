import express from "express";

import { createPaymentIntent } from "../controllers/index.js";
import { verifyToken } from "../middlewares/user-auth.middleware.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;
