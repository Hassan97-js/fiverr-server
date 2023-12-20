import express from "express";

import { getUser, deleteUser } from "../controllers/user";

import { verifyToken } from "../middlewares/verify";
import { validate } from "../middlewares/validate";

import { checkObjectIdValidator } from "../constants/validator";

const router = express.Router();

// router.get("/current", verifyToken, getUser);
router.get("/current", verifyToken);
// router.delete(
//   "/:id",
//   verifyToken,
//   validate(checkObjectIdValidator),
//   deleteUser
// );

export default router;
