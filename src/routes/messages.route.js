import express from "express";

import { verifyToken } from "../middlewares/index.js";

import { getMessages, createMessage } from "../controllers/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:id", getMessages);
router.post("/single", createMessage);

export default router;
