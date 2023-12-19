import User from "../models/user";

import { httpsCodes } from "../constants/http";
import { type NextFunction, type Request, type Response } from "express";

const { OK, NOT_FOUND, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get a user
 * @route /api/user/current
 * @access private
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;

    const user = await User.findById(userId).lean();

    if (!user) {
      res.status(NOT_FOUND);
      throw Error("User does not exist");
    }

    const userToSend = {
      id: user._id,
      username: user.username,
      email: user.email,
      country: user.country,
      isSeller: user.isSeller,
    };

    return res.status(OK).json({
      user: userToSend,
      success: true,
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

    const user = await User.findById(paramsId).lean();

    if (!user) {
      res.status(NOT_FOUND);
      throw Error("User not found");
    }

    const { id: loggedInUserId } = req.user;

    if (loggedInUserId !== user._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    await User.findByIdAndDelete(loggedInUserId);

    return res.status(OK).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
