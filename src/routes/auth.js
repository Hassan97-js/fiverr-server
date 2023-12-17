import express from "express";
import { check } from "express-validator";

import { signIn, signOut, signUp } from "../controllers/auth.js";

import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/verify.js";

import { signInValidation, signUpValidation } from "../constants/validator.js";

const router = express.Router();

router.post("/sign-up", validate(signUpValidation), signUp);
router.post("/sign-in", validate(signInValidation), signIn);
router.post("/sign-out", verifyToken, signOut);

export default router;
