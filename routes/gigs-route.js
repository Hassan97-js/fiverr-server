import express from "express";

import { getAllGigs, getGig, createGig, deleteGig } from "../controllers/index.js";
import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.get("/", verifyToken, getAllGigs);
router.get("/single/:id", verifyToken, getGig);
router.post("/single", verifyToken, createGig);
router.delete("/single/:id", verifyToken, deleteGig);

export default router;
