import { Gig, Review } from "../models/index.js";
import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = constants.httpCodes;

/** 
  @desc Get all reviews 
  @route /api/reviews/:gigId
  @access public 
*/
export const getReviews = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gigId }).populate("userId", [
      "username",
      "isSeller",
      "country"
    ]);

    return res.status(OK).json(reviews);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Create a review
  @route /api/reviews/single
  @access private
*/
export const createReview = async (req, res, next) => {
  try {
    const { gigId, description, starNumber } = req.body;

    const { id: userId, isSeller } = req.user;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers cannot create a review!");
    }

    const dbReview = await Review.findOne({ userId, gigId });

    if (dbReview) {
      res.status(FORBIDDEN);
      throw Error("You have already created a reivew!");
    }

    // TODO: check if the user purchased the gig - ORDER Model

    const newReview = await Review.create({
      userId,
      gigId,
      description,
      starNumber
    });

    await Gig.findOneAndUpdate(
      { gigId },
      {
        $inc: { totalStars: 1, starNumber }
      },
      {
        new: true
      }
    );

    return res.status(CREATED).json(newReview);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Delete a review
  @route /api/reviews/single/:gigId
  @access public
*/
export const deleteReview = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const { id: loggedInUserId } = req.user;

    const dbReview = await Review.findOne({ gigId, userId: loggedInUserId });

    if (!dbReview) {
      res.status(NOT_FOUND);
      throw Error("Review not found!");
    }

    if (dbReview.userId.toString() !== loggedInUserId) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized!");
    }

    await Review.findOneAndDelete({ gigId, userId: loggedInUserId });

    res.status(OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};
