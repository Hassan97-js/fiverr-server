import express from "express";

import { getUser, deleteUser } from "../controllers/user.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.use("/:id", verifyToken);

router.get("/current", getUser);
router.delete("/:id", deleteUser);

export default router;
