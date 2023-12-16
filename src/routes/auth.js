import express from "express";
import { check } from "express-validator";

import { signIn, signOut, signUp } from "../controllers/auth.js";

import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post(
  "/sign-up",
  validate([
    check("email").isEmail().normalizeEmail(),
    check("username").not().isEmpty().trim().escape(),
    check("password").notEmpty().isLength({ min: 8 }),
  ]),
  signUp
);
router.post(
  "/sign-in",
  validate([
    check("username").not().isEmpty().trim().escape(),
    check("password").not().notEmpty(),
  ]),
  signIn
);
router.post("/sign-out", verifyToken, signOut);

export default router;
