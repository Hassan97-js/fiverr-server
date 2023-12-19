import express from "express";

import { verifyToken } from "../middlewares/verify";

import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
} from "../controllers/conversations";
import { validate } from "../middlewares/validate";
import {
  getConversationValidator,
  createConversationValidator,
  updateConversationValidator,
} from "../constants/validator";

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
