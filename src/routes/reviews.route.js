import express from "express";

import {
  getReviews,
  createReview,
  // getReview,
  deleteReview
} from "#controllers";

import { verifyToken } from "#middlewares";

const router = express.Router();

router.get("/:gigId", getReviews);
// router.get("/single/:gigId", getReview);
router.post("/single", verifyToken, createReview);
router.delete("/single/:gigId", verifyToken, deleteReview);

export default router;
