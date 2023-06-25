import express from "express";

import {
  getReviews,
  createReview,
  getReview,
  deleteReview
} from "../controllers/index.js";

import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.get("/:id", getReviews);
// router.get("/single/:id", getReview);
router.post("/", verifyToken, createReview);
router.delete("/single/:id", deleteReview);

export default router;
