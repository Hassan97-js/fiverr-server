import express from "express";

import { verifyToken } from "../middlewares/index.js";

import { getMessages, createMessage } from "../controllers/index.js";

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.post("/single", verifyToken, createMessage);

export default router;
