import { Gig } from "../models/index.js";

import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, VALIDATION_ERROR } = constants.httpCodes;

/** 
  @desc Get all gigs
  @route /api/gigs
  @access private
*/
async function getAllGigs(req, res, next) {
  try {
    res.send("Get all Gigs controller (Authenticated)");
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Get a single gig
  @route /api/gigs/single/:id
  @access private
*/
async function getGig(req, res, next) {
  try {
    const {id: paramsGigId} = req.params;

    const dbGig = await Gig.findById(paramsGigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("No gig found with this ID.");
    }

    const { id: userId } = req.userAuth;

    if (dbGig.userId !== userId) {
      res.status(FORBIDDEN);
      throw Error("You can only get your gig.");
    }

    const foundGig = await Gig.findById(paramsGigId);

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

    console.log(userId, isSeller);

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

    if (dbGig.userId !== userId) {
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
