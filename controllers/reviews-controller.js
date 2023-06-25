import { Gig, Review } from "../models/index.js";

import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED } = constants.httpCodes;

/** 
  @desc Get all reviews 
  @route /api/reviews
  @access public 
*/
async function getReviews(req, res, next) {
  try {
    const { id: gigId } = req.params;

    const reviews = await Review.find({ gigId });

    return res.status(OK).json(reviews);
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Get a review 
  @route /api/reviews/single/:id
  @access public
*/
async function getReview(req, res, next) {
  try {
    return res.json({ review: "review" });
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Create a review
  @route /api/review
  @access private
*/
async function createReview(req, res, next) {
  try {
    const { id: userId, isSeller } = req.userAuth;
    const { gigId, description, starNumber } = req.body;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers can not create a review.");
    }

    const existingReview = await Review.findOne({ userId, gigId });

    if (existingReview) {
      res.status(FORBIDDEN);
      throw Error("You have already created a reivew.");
    }

    /* *
       TODO: check if the user purchased the gig user order Model  
      */

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
      }
    );

    const updatedGig = await Gig.findById(gigId);

    return res.status(CREATED).json({ newReview, updatedGig });
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Delete a review
  @route /api/review/single/:id
  @access public
*/
async function deleteReview(req, res, next) {
  return res.json({ deleted: true });
}

export { getReviews, getReview, deleteReview, createReview };
