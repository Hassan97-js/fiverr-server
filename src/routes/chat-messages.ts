import express from "express";

import { verifyToken } from "../middlewares/verify";

import { getChatMessages, createMessage } from "../controllers/chat-messages";

import { validate } from "../middlewares/validate";
import {
  getChatMessagesValidator,
  createMessageValidator,
} from "../constants/validator";

const router = express.Router();

router.use(verifyToken);

router.get("/:id", validate(getChatMessagesValidator), getChatMessages);
router.post("/single", validate(createMessageValidator), createMessage);

export default router;
