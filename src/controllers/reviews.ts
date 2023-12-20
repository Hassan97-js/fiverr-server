import Gig from "../models/gig";
import Review from "../models/review";
import Order from "../models/order";

import { httpsCodes } from "../constants/http";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get all reviews
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/:gigId
 * @access public
 */
export const getReviews = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gigId }).populate("userId", [
      "username",
      "email",
      "image",
      "country",
      "isSeller",
    ]);

    return res.status(OK).json({ success: true, reviews });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};

/**
 * @desc Create a review
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/single
 * @access private
 */
export const createReview = async (req, res, next) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { gigId, description, starNumber } = req.body;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers cannot create a review");
    }

    const review = await Review.findOne({ userId, gigId }).lean();

    if (review) {
      res.status(FORBIDDEN);
      throw Error("Reivew already created");
    }

    const order = await Order.findOne({
      buyerId: userId,
      gigId,
      isCompleted: true,
    });

    if (!order) {
      res.status(UNAUTHORIZED);
      throw Error("User has not purchased the gig");
    }

    const newReview = await Review.create({
      userId,
      gigId,
      description,
      starNumber,
    });

    if (!newReview) {
      res.status(UNAUTHORIZED);
      throw Error("Error creating a review");
    }

    const gig = await Gig.findOneAndUpdate(
      { _id: gigId },
      {
        $inc: { totalStars: 1, starNumber },
      },
      {
        new: true,
      }
    );

    if (!gig) {
      res.status(UNAUTHORIZED);
      throw Error("Error updating gig totalStars and starNumber");
    }

    return res.status(CREATED).json({ success: true, review: newReview });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};

/**
 * @desc Delete a review
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/single/:gigId
 * @access private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id: loggedInUserId } = req.user;
    const { gigId } = req.params;

    const review = await Review.findOne({
      gigId,
      userId: loggedInUserId,
    }).lean();

    if (!review) {
      res.status(NOT_FOUND);
      throw Error("Review not found");
    }

    if (review.userId.toString() !== loggedInUserId) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const deletedReview = await Review.findOneAndDelete({
      gigId,
      userId: loggedInUserId,
    });

    if (!deletedReview) {
      res.status(UNAUTHORIZED);
      throw Error("Error deleting a review");
    }

    res.status(OK).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};
