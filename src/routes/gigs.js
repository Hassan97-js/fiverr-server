import express from "express";
import { query } from "express-validator";

import {
  getGigs,
  getPrivateGigs,
  getGig,
  createGig,
  deleteGig,
} from "../controllers/gigs.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get(
  "/",
  validate([
    query("search").trim().toLowerCase().escape().optional(),
    query("min").trim().escape().optional(),
    query("max").trim().escape().optional(),
    query("sort").trim().toLowerCase().escape().optional(),
  ]),
  getGigs
);
router.get("/private", verifyToken, getPrivateGigs);
router.get("/single/:id", getGig);
router.post("/single", verifyToken, createGig);
router.delete("/single/:id", verifyToken, deleteGig);

export default router;
