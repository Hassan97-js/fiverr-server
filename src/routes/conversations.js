import express from "express";

import { verifyToken } from "../middlewares/verify.js";

import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
} from "../controllers/conversations.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getConversations);
router.get("/single/:id", getConversation);
router.post("/single", createConversation);
router.put("/single", updateConversation);

export default router;
