import express from "express";

import { verifyToken } from "../middlewares/verify";

import { getMessages, createMessage } from "../controllers/messages";

import { validate } from "../middlewares/validate";
import {
  getMessagesValidator,
  createMessageValidator,
} from "../constants/validator";

const router = express.Router();

router.use(verifyToken);

router.get("/:id", validate(getMessagesValidator), getMessages);
router.post("/single", validate(createMessageValidator), createMessage);

export default router;
