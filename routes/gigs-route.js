import express from "express";

import { getAllGigs, getGig, createGig, deleteGig } from "../controllers/index.js";
import { verifyToken, verifyGigIDValidity } from "../middlewares/index.js";

const router = express.Router();

router.use("/single/:id", verifyGigIDValidity);
router.use(verifyToken);

router.get("/", getAllGigs);
router.get("/single/:id", getGig);
router.post("/single", createGig);
router.delete("/single/:id", deleteGig);

export default router;
