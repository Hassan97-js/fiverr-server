import express from "express";

import { deleteUser } from "../controllers/index.js";
import { verifyToken, verifyUserIDValidity } from "../middlewares/index.js";

const router = express.Router();

router.use("/:id", verifyUserIDValidity, verifyToken);

router.delete("/:id", deleteUser);

export default router;
