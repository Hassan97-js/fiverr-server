import express from "express";
import { query } from "express-validator";

import { getAllGigs, getGig, createGig, deleteGig } from "../controllers/index.js";
import { verifyToken, verifyGigIDValidity, validate } from "../middlewares/index.js";

const router = express.Router();

router.use("/single/:id", verifyGigIDValidity);

router.get(
  "/",
  validate([
    query("category").trim().notEmpty().escape().optional(),
    query("title").trim().notEmpty().escape().optional(),
    query("sortBy").trim().notEmpty().escape().optional()
  ]),
  getAllGigs
);
router.get("/single/:id", getGig);
router.post("/single", verifyToken, createGig);
router.delete("/single/:id", verifyToken, deleteGig);

export default router;
