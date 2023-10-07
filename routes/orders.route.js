import express from "express";

import { verifyToken } from "../middlewares/index.js";

import { confirmOrder, getOrders } from "../controllers/index.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.put("/single", verifyToken, confirmOrder);

export default router;
