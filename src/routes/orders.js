import express from "express";

import { confirmOrder, getOrders } from "../controllers/orders.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";

import { confirmOrderValidator } from "../constants/validator.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.put(
  "/single",
  verifyToken,
  validate(confirmOrderValidator),
  confirmOrder
);

export default router;
