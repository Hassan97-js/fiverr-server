import express from "express";
import { query } from "express-validator";

import {
  getGigs,
  getMyGigs,
  getGig,
  createGig,
  deleteGig
} from "../controllers/index.js";
import { verifyToken, verifyGigIDValidity, validate } from "../middlewares/index.js";

const router = express.Router();

router.use("/single/:id", verifyGigIDValidity);

router.get(
  "/",
  validate([
    query("search").trim().toLowerCase().escape().optional(),
    query("min").trim().escape().optional(),
    query("max").trim().escape().optional(),
    query("sort").trim().toLowerCase().escape().optional()
  ]),
  getGigs
);
router.get("/my", verifyToken, getMyGigs);
router.get("/single/:id", getGig);
router.post("/single", verifyToken, createGig);
router.delete("/single/:id", verifyToken, deleteGig);

export default router;
