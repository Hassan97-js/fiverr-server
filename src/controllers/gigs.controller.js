import { decode } from "html-entities";

import { Gig } from "#models";
import constants from "#constants";

const { OK, NOT_FOUND, FORBIDDEN, CREATED } = constants.httpCodes;

/** 
  @desc Get a user gigs
  @route /api/gigs/my
  @access private
*/
export const getMyGigs = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const myGigs = await Gig.find({ userId }).populate("userId");

    res.status(OK).json(myGigs);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Get all gigs
  @route /api/gigs
  @access public
*/
export const getGigs = async (req, res, next) => {
  try {
    const { sort: sortBy, search, min, max } = req.query;

    let filterQuery = {};

    if (min || max) {
      min && (filterQuery.price = { $gte: parseInt(min) });
      max && (filterQuery.price = { $lte: parseInt(max) });
    }

    if (min && max) {
      filterQuery.price = { $gte: parseInt(min), $lte: parseInt(max) };
    }

    if (search) {
      filterQuery = {
        ...filterQuery,
        $text: {
          $search: `"${decode(search)}"`,
          $caseSensitive: false,
          $diacriticSensitive: false
        }
      };
    }

    const sortByKey = sortBy || "createdAt";

    const gigs = await Gig.find(filterQuery)
      .populate("userId")
      .sort({
        [sortByKey]: -1
      });

    res.status(OK).json(gigs);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Get a single gig
  @route /api/gigs/single/:id
  @access public
*/
export const getGig = async (req, res, next) => {
  try {
    const { id: gigId } = req.params;

    const dbGig = await Gig.findById(gigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found!");
    }

    const foundGig = await dbGig.populate("userId", [
      "username",
      "email",
      "image",
      "country",
      "isSeller"
    ]);

    res.status(OK).json(foundGig);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Create a new gig
  @route /api/gigs/single
  @access private
*/
export const createGig = async (req, res, next) => {
  try {
    const { id: userId, isSeller } = req.user;

    if (isSeller === false) {
      res.status(FORBIDDEN);
      throw Error("You are not authorized to create a gig!");
    }

    const newGig = await Gig.create({
      ...req.body,
      userId
    });

    res.status(CREATED).json(newGig);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Delete a gig
  @route /api/gigs/single/:id
  @access private
*/
export const deleteGig = async (req, res, next) => {
  try {
    const { id: gigId } = req.params;

    const dbGig = await Gig.findById(gigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found!");
    }

    const { id: userId } = req.user;

    if (dbGig.userId.toString() !== userId) {
      res.status(FORBIDDEN);
      throw Error("You are not authorized to delete this gig!");
    }

    await Gig.findByIdAndDelete(gigId);

    res.status(OK).json({ message: "Gig has been deleted!" });
  } catch (error) {
    next(error);
  }
};
