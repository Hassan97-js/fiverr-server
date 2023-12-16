import User from "../models/user.js";

import { httpsCodes } from "../constants.js";

const { OK, NOT_FOUND } = httpsCodes;

/**
 * @desc Get a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/user/current
 * @access private
 */
export const getUser = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const dbUser = await User.findById(userId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("User does not exist!");
    }

    return res.status(OK).json(req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/user/:id
 * @access private
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id: paramsId } = req.params;

    const { OK, NOT_FOUND, UNAUTHORIZED } = constants.httpCodes;

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("User not found!");
    }

    const { id: loggedInUserId } = req.user;

    if (loggedInUserId !== dbUser._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized!");
    }

    await User.findByIdAndDelete(loggedInUserId);

    return res.status(OK).json({
      message: "User deleted!",
    });
  } catch (error) {
    next(error);
  }
};
