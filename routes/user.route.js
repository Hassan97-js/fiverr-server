import express from "express";

import { getUser, deleteUser } from "../controllers/index.js";
import { verifyToken, verifyUserID } from "../middlewares/index.js";

const router = express.Router();

router.get("/:id", verifyUserID, verifyToken, getUser);
router.delete("/:id", verifyUserID, verifyToken, deleteUser);

export default router;
