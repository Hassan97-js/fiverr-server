import express from "express";

import { getUser, deleteUser } from "../controllers/user.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";

import { checkObjectIdValidator } from "../constants/validator.js";

const router = express.Router();

router.get("/current", verifyToken, getUser);
router.delete(
  "/:id",
  verifyToken,
  validate(checkObjectIdValidator),
  deleteUser
);

export default router;
