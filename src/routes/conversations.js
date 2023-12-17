import express from "express";

import { verifyToken } from "../middlewares/verify.js";

import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
} from "../controllers/conversations.js";
import { validate } from "../middlewares/validate.js";
import {
  getConversationValidator,
  createConversationValidator,
  updateConversationValidator,
} from "../constants/validator.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getConversations);
router.get("/single/:id", validate(getConversationValidator), getConversation);
router.post(
  "/single",
  validate(createConversationValidator),
  createConversation
);
router.put(
  "/single",
  validate(updateConversationValidator),
  updateConversation
);

export default router;
