import express from "express";

import { verifyToken } from "../middlewares/verify";

import { getChats, getChat, createChat, updateChat } from "../controllers/chats";
import { validate } from "../middlewares/validate";
import {
  getChatValidator,
  createChatValidator,
  updateChatValidator
} from "../constants/validator";

const router = express.Router();

router.use(verifyToken);

router.get("/", getChats);
router.get("/single/:id", validate(getChatValidator), getChat);
router.post("/single", validate(createChatValidator), createChat);
router.put("/single", validate(updateChatValidator), updateChat);

export default router;
