import express from "express";

import { signIn, signOut, signUp } from "../controllers/auth";

import { validate } from "../middlewares/validate";
import { verifyToken } from "../middlewares/verify";

import { signInValidation, signUpValidation } from "../constants/validator";

const router = express.Router();

router.post("/sign-in", validate(signInValidation), signIn);
router.post("/sign-up", validate(signUpValidation), signUp);
router.post("/sign-out", verifyToken, signOut);

export default router;
