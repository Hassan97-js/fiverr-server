import { Gig } from "../models/index.js";

import { fromKebabToPascal } from "../utils/index.js";

import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED } = constants.httpCodes;

/**
 * TODO
 *
 * */

/** 
  @desc Get all gigs
  @route /api/gigs
  @access public
*/
async function getAllGigs(req, res, next) {
  try {
    // const { id: userId, isSeller } = req.userAuth;

    // if (!isSeller) {
    //   res.status(FORBIDDEN);
    //   throw Error("Only sellers can have gigs.");
    // }

    // const userGigs = await Gig.find({ userId });

    // if (!userGigs) {
    //   res.status(NOT_FOUND);
    //   throw Error("You have not created any gigs.");
    // }

    // NOTE: expect queries to be kebab-case
    const {
      sortBy = "",
      category = "",
      search = "",
      min = "",
      max = ""
    } = req.query;

    const readyCategory = fromKebabToPascal(category);
    const readySearch = { $regex: fromKebabToPascal(search) };

    const mongoFilters = {};

    if (category) {
      mongoFilters.category = readyCategory;
    }

    if (min || max) {
      min && (mongoFilters.price = { $gte: min });
      max && (mongoFilters.price = { $lte: max });
    }

    if (min && max) {
      mongoFilters.price = { $gte: min, $lte: max };
    }

    if (search) {
      mongoFilters.title = readySearch;
    }

    const sortByKey = sortBy || "createdAt";

    const allGigs = await Gig.find(mongoFilters)
      .populate("userId")
      .sort({
        [sortByKey]: -1
      });

    res.status(OK).json(allGigs);
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Get a single gig
  @route /api/gigs/single/:id
  @access public
*/
async function getGig(req, res, next) {
  try {
    const { id: paramsGigId } = req.params;

    const dbGig = await Gig.findById(paramsGigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("No gig found with this ID.");
    }

    // const { id: userId } = req.userAuth;

    // if (dbGig.userId.toString() !== userId) {
    //   res.status(FORBIDDEN);
    //   throw Error("You can only get your gig.");
    // }

    const foundGig = await Gig.findById(paramsGigId).populate("userId");

    res.status(OK).json(foundGig);
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Create a new gig
  @route /api/gigs/single
  @access private
*/
async function createGig(req, res, next) {
  try {
    const { id: userId, isSeller } = req.userAuth;

    if (!isSeller) {
      res.status(FORBIDDEN);
      throw Error("Only sellers can create a gig.");
    }

    const newGig = await Gig.create({
      ...req.body,
      userId
    });

    res.status(CREATED).json(newGig);
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Delete a gig
  @route /api/gigs/single/:id
  @access private
*/
async function deleteGig(req, res, next) {
  try {
    const { id: paramsGigId } = req.params;

    const dbGig = await Gig.findById(paramsGigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("No gig found with this ID.");
    }

    const { id: userId } = req.userAuth;

    if (dbGig.userId.toString() !== userId) {
      res.status(FORBIDDEN);
      throw Error("You can only delete your gigs.");
    }

    await Gig.findByIdAndDelete(paramsGigId);

    res.status(OK).json({ message: "Gig has been deleted." });
  } catch (error) {
    next(error);
  }
}

export { getAllGigs, getGig, createGig, deleteGig };
