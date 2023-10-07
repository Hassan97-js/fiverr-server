import express from "express";

import {
  getReviews,
  createReview,
  // getReview,
  deleteReview
} from "../controllers/index.js";

import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.get("/:gigId", getReviews);
// router.get("/single/:gigId", getReview);
router.post("/single", verifyToken, createReview);
router.delete("/single/:gigId", verifyToken, deleteReview);

export default router;
