import { User } from "../models/index.js";
import constants from "../constants.js";

const { OK, NOT_FOUND } = constants.httpCodes;

/**
 * @desc Get a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/user/:id
 * @access private
 */
export const getUser = async (req, res, next) => {
  try {
    const { id: paramsId } = req.params;

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("User does not exist!");
    }

    return res.status(OK).json({
      id: dbUser._id,
      username: dbUser.username,
      email: dbUser.email,
      isSeller: dbUser.isSeller,
      country: dbUser.country
    });
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
      message: "User deleted!"
    });
  } catch (error) {
    next(error);
  }
};
