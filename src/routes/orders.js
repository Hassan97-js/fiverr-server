import express from "express";

import { verifyToken } from "../middlewares/verify.js";
import { confirmOrder, getOrders } from "../controllers/orders.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.put("/single", verifyToken, confirmOrder);

export default router;
