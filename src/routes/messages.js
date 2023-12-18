import express from "express";

import { verifyToken } from "../middlewares/verify.js";

import { getMessages, createMessage } from "../controllers/messages.js";

import { validate } from "../middlewares/validate.js";
import { getMessagesValidator, createMessageValidator } from "../constants/validator.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:id", validate(getMessagesValidator), getMessages);
router.post("/single", validate(createMessageValidator), createMessage);


export default router;
