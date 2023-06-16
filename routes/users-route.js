import express from "express";

import { getUser, deleteUser } from "../controllers/index.js";
import { verifyToken, verifyUserIDValidity } from "../middlewares/index.js";

const router = express.Router();

router.use("/:id", verifyUserIDValidity, verifyToken);

router.get("/:id", getUser);
router.delete("/:id", deleteUser);

export default router;
