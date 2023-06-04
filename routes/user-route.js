import express from "express";

import { deleteUser } from "../controllers/index.js";
import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);

export default router;
