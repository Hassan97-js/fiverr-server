import express from "express";

import { deleteUser } from "../controllers/index.js";
import { verifyToken, verifyUserIDValidity } from "../middlewares/index.js";

const router = express.Router();

router.delete("/:id", verifyUserIDValidity, verifyToken, deleteUser);

export default router;
