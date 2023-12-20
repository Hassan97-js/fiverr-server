import mongoose from "mongoose";
import { decode } from "html-entities";

import Gig from "../models/gig";
import { httpsCodes } from "../constants/http";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get user private gigs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/private
 * @access private
 */
export const getPrivateGigs = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const gigs = await Gig.find({ userId })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    res.status(OK).json({
      gigs,
      success: true,
    });
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
          $diacriticSensitive: false,
        },
      };
    }

    const sortByKey = sortBy || "createdAt";

    const gigs = await Gig.find(filterQuery)
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .sort({
        [sortByKey]: -1,
      })
      .lean();

    res.status(OK).json({
      success: true,
      gigs,
    });
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

    const gig = await Gig.findById(gigId);

    if (!gig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found");
    }

    const foundGig = await gig.populate("userId", [
      "username",
      "email",
      "image",
      "country",
      "isSeller",
    ]);

    res.status(OK).json({ success: true, gig: foundGig });
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
 *  @desc Create a new gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single
 * @access private
 */
export const createGig = async (req, res, next) => {
  try {
    const { title: gigTitle } = req.body;
    const { id: userId, isSeller, username, email } = req.user;

    if (!isSeller) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const gig = await Gig.findOne({ title: gigTitle }).lean();

    if (gig) {
      res.status(FORBIDDEN);
      throw Error("Gig title already exists");
    }

    const newGig = await Gig.create({
      ...req.body,
      userId,
    });

    res.status(CREATED).json(newGig);
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

    const dbGig = await Gig.findById(gigId).lean();

    if (!dbGig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found");
    }

    const { id: loggedInUserId } = req.user;

    if (dbGig.userId.toString() !== loggedInUserId) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    await Gig.findByIdAndDelete(gigId);

    res.status(OK).json({ success: true, message: "Gig deleted" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};
