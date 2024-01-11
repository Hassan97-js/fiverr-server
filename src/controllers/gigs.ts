import { Request, Response, NextFunction } from "express";
import { decode } from "html-entities";

import Gig from "../models/gig";
import { httpsCodes } from "../constants/http";

import type { TGigsFilterQuery } from "../types/gigs";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/gigs/private
 * @access private
 */
export const getPrivateGigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;

    const gigs = await Gig.find({ userId })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    res.status(OK).json({
      gigs,
      success: true
    });
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
 * @route /api/gigs
 * @access public
 */
export const getGigs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sortBy: sortBy, search, min, max } = req.query;

    let filterQuery: TGigsFilterQuery = {};

    if (typeof min === "string" && min) {
      filterQuery.price = { ...filterQuery.price, $gte: min };
    }

    if (typeof max === "string" && max) {
      filterQuery.price = { ...filterQuery.price, $lte: max };
    }

    if (typeof min === "string" && typeof max === "string" && min && max) {
      filterQuery.price = { $gte: min, $lte: max };
    }

    if (typeof search === "string" && search) {
      filterQuery = {
        ...filterQuery,
        $text: {
          $search: `"${decode(search)}"`,
          $caseSensitive: false,
          $diacriticSensitive: false
        }
      };
    }

    let sortByKey = String(sortBy);

    switch (sortByKey) {
      case "newest": {
        sortByKey = "createdAt";
        break;
      }

      case "best selling": {
        sortByKey = "sales";
        break;
      }

      default: {
        sortByKey = "createdAt";
      }
    }

    const gigs = await Gig.find(filterQuery)
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .sort({
        [sortByKey]: -1
      })
      .lean();

    res.status(OK).json({
      success: true,
      gigs
    });
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
 * @route /api/gigs/single/:id
 * @access public
 */
export const getGig = async (req: Request, res: Response, next: NextFunction) => {
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
      "isSeller"
    ]);

    res.status(OK).json({ success: true, gig: foundGig });
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
 * @route /api/gigs/single
 * @access private
 */
export const createGig = async (req: Request, res: Response, next: NextFunction) => {
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
      userId
    });

    res.status(CREATED).json({ success: true, gig: newGig });
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
 * @route /api/gigs/single/:id
 * @access private
 */
export const deleteGig = async (req: Request, res: Response, next: NextFunction) => {
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

    if (typeof error === "string") {
      next(error);
    }
  }
};
