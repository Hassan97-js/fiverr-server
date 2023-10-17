import express from "express";

import { verifyToken } from "#middlewares";

import {
  getMessages,
  createMessage,
} from "#controllers";

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.post("/single", verifyToken, createMessage);

export default router;