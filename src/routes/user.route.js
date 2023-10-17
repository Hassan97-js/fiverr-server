import express from "express";

import { getUser, deleteUser } from "#controllers";
import { verifyToken, verifyUserID } from "#middlewares";

const router = express.Router();

router.use("/:id", verifyUserID, verifyToken);

router.route("/:id").get(getUser).delete(deleteUser);

export default router;
