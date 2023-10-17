import { Gig, Review } from "#models";
import constants from "#constants";


const { OK, NOT_FOUND, FORBIDDEN, CREATED } = constants.httpCodes;

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
      throw Error("Sellers can not create a review!");
    }

    const dbReview = await Review.findOne({ userId, gigId });

    if (dbReview) {
      res.status(FORBIDDEN);
      throw Error("You have already created a reivew!");
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

    const updatedGig = await Gig.findOneAndUpdate(
      { gigId },
      {
        $inc: { totalStars: 1, starNumber }
      },
      {
        new: true
      }
    );

    return res.status(CREATED).json({ newReview, updatedGig });
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

    const dbReview = await Review.findOne({ gigId });

    if (!dbReview) {
      res.status(NOT_FOUND);
      throw Error("Review not found!");
    }

    await Review.findOneAndDelete({ gigId });

    res.status(OK).json({ message: "Review has been deleted!" });
  } catch (error) {
    next(error);
  }
};
