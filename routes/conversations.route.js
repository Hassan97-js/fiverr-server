import express from "express";

import { verifyToken } from "../middlewares/index.js";

import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation
} from "../controllers/index.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.get("/single/:id", verifyToken, getConversation);
router.post("/single", verifyToken, createConversation);
router.put("/single", verifyToken, updateConversation);

export default router;
