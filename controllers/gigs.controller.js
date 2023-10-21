import { decode } from "html-entities";

import { Gig } from "../models/index.js";
import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = constants.httpCodes;

/**
 * @desc Get a user gigs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/my
 * @access private
 */
export const getMyGigs = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const myGigs = await Gig.find({ userId })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    res.status(OK).json(myGigs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all gigs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs
 * @access public
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
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .sort({
        [sortByKey]: -1
      })
      .lean();

    res.status(OK).json(gigs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get a single gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single/:id
 * @access public
 */
export const getGig = async (req, res, next) => {
  try {
    const { id: gigId } = req.params;

    if (!gigId) {
      res.status(FORBIDDEN);
      throw Error("Gig ID is required!");
    }

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
 *  @desc Create a new gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single
 * @access private
 */
export const createGig = async (req, res, next) => {
  try {
    const { id: userId, isSeller } = req.user;

    if (!isSeller) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized!");
    }

    const dbGig = await Gig.findOne({ title: req.body.title }).lean();

    if (dbGig) {
      res.status(FORBIDDEN);
      throw Error("You have one gig with the same title!");
    }

    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.category ||
      !req.body.price ||
      !req.body.coverImage ||
      !req.body.shortTitle ||
      !req.body.shortDescription ||
      !req.body.deliveryTime ||
      !req.body.revisionNumber
    ) {
      res.status(FORBIDDEN);
      throw Error("All fields are required!");
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
 * @desc Delete a gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single/:id
 * @access private
 */
export const deleteGig = async (req, res, next) => {
  try {
    const { id: gigId } = req.params;

    if (!gigId) {
      res.status(FORBIDDEN);
      throw Error("Gig ID is required!");
    }

    const dbGig = await Gig.findById(gigId).lean();

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found!");
    }

    const { id: loggedInUserId } = req.user;

    if (dbGig.userId.toString() !== loggedInUserId) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized!");
    }

    await Gig.findByIdAndDelete(gigId);

    res.status(OK).json({ message: "Gig has been deleted!" });
  } catch (error) {
    next(error);
  }
};
