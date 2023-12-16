import express from "express";

import { getUser, deleteUser } from "../controllers/user.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.get("/current", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
