import express from "express";

import { getReviews, createReview, deleteReview } from "../controllers/reviews";

import { verifyToken } from "../middlewares/verify";
import { validate } from "../middlewares/validate";
import {
  deleteReviewValidator,
  createReviewValidator,
  getReviewsValidator,
} from "../constants/validator";

const router = express.Router();

router.get("/:gigId", validate(getReviewsValidator), getReviews);
router.post(
  "/single",
  verifyToken,
  validate(createReviewValidator),
  createReview
);
router.delete(
  "/single/:gigId",
  verifyToken,
  validate(deleteReviewValidator),
  deleteReview
);

export default router;
