import express from "express";

import { getUser, deleteUser } from "../controllers/index.js";
import { verifyToken, verifyUserID } from "../middlewares/index.js";

const router = express.Router();

router.use("/:id", verifyUserID, verifyToken);

router.route("/:id").get(getUser).delete(deleteUser);

export default router;
