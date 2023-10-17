import express from "express";

import { verifyToken } from "#middlewares";

import { confirmOrder, getOrders } from "#controllers";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.put("/single", verifyToken, confirmOrder);

export default router;
