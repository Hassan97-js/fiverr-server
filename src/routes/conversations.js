import express from "express";

import { verifyToken } from "../middlewares/index.js";

import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation
} from "../controllers/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getConversations);
router.get("/single/:id", getConversation);
router.post("/single", createConversation);
router.put("/single", updateConversation);

export default router;
