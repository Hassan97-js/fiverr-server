import express from "express";
import { check } from "express-validator";

import { signIn, signOut, signUp } from "../controllers/auth";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

/* 
username
password
*/
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
router.post("/sign-out", signOut);

export default router;
