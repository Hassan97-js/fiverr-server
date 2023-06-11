import { Gig } from "../models/index.js";

import constants from "../constants.js";

const { UNAUTHORIZED, NOT_FOUND, FORBIDDEN, CREATED, VALIDATION_ERROR } =
  constants.httpCodes;

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
    res.send("Get a Gig controller (Authenticated)");
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
    const paramsGigId = req.params?.id;

    if (!paramsGigId) {
      res.status(VALIDATION_ERROR);
      throw Error("No Gig ID was provided.");
    }

    const dbGig = await Gig.findById(paramsGigId);

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("No gig found with this ID.");
    }

    const { id: userId } = req.userAuth;

    if (dbGig.userId !== userId) {
      res.status(UNAUTHORIZED);
      throw Error("You can only delete your gigs.");
    }

    await Gig.findByIdAndDelete(paramsGigId);

    // TODO: FROM HERE
    res.json({ message: "Gig has been deleted." });
  } catch (error) {
    next(error);
  }
}

export { getAllGigs, getGig, createGig, deleteGig };
