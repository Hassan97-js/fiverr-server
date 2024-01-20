import { type Request, type Response, type NextFunction } from "express";

import Gig from "../models/gig";
import Review from "../models/review";
import Order from "../models/order";

import { httpsCodes } from "../constants/http";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/reviews/:gigId
 * @access public
 */
export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gigId })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .select(["userId", "gigId", "rating", "description"]);

    return res.status(OK).json({ success: true, reviews });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};

/**
 * @route /api/reviews/single
 * @access private
 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { gigId, description, rating } = req.body;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers cannot create a review");
    }

    const review = await Review.findOne({ userId, gigId }).lean();

    if (review) {
      res.status(FORBIDDEN);
      throw Error("Reivew already created");
    }

    // const order = await Order.findOne({
    //   buyerId: userId,
    //   gigId,
    //   isCompleted: true
    // });

    // if (!order) {
    //   res.status(UNAUTHORIZED);
    //   throw Error("User has not purchased the gig");
    // }

    const newReview = await Review.create({
      userId,
      gigId,
      description,
      rating
    });

    await Gig.findOneAndUpdate(
      { _id: gigId },
      {
        $inc: { ratingsSum: rating, numberOfRatings: 1 }
      },
      {
        new: true
      }
    );

    return res.status(CREATED).json({ success: true, review: newReview });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};

/**
 * @route /api/reviews/single/:gigId
 * @access private
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: loggedInUserId } = req.user;
    const { gigId, decrementRatings } = req.params;

    const review = await Review.findOne({
      gigId,
      userId: loggedInUserId
    }).lean();

    if (!review) {
      res.status(NOT_FOUND);
      throw Error("Review not found");
    }

    if (review.userId.toString() !== loggedInUserId) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    await Review.findOneAndDelete({
      gigId,
      userId: loggedInUserId
    });

    await Gig.findOneAndUpdate(
      { _id: gigId },
      {
        $inc: { ratingsSum: -parseInt(decrementRatings), numberOfRatings: -1 }
      },
      {
        new: true
      }
    );

    res.status(OK).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};
