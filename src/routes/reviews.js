import express from "express";

import {
  getReviews,
  createReview,
  deleteReview,
} from "../controllers/reviews.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";
import {
  deleteReviewValidator,
  createReviewValidator,
  getReviewsValidator,
} from "../constants/validator.js";

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
