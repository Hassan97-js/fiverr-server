import express from "express";

import { confirmOrder, getOrders } from "../controllers/orders";

import { verifyToken } from "../middlewares/verify";
import { validate } from "../middlewares/validate";

import { confirmOrderValidator } from "../constants/validator";

const router = express.Router();

router.get("/", verifyToken, getOrders);
// TODO: FIX confirmOrderValidator
router.put("/single", verifyToken, validate(confirmOrderValidator), confirmOrder);

export default router;
