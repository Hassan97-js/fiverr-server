import User from "../models/user";

import { httpsCodes } from "../constants/http";
import { type NextFunction, type Request, type Response } from "express";

const { OK, NOT_FOUND, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/user/current
 * @access private
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user;

    const user = await User.findById(userId).lean();

    if (!user) {
      res.status(NOT_FOUND);
      throw Error("User does not exist");
    }

    const userToSend = {
      _id: user._id,
      username: user.username,
      email: user.email,
      country: user.country,
      isSeller: user.isSeller,
      image: user.image
    };

    return res.status(OK).json({
      user: userToSend,
      success: true
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
 * @route /api/user/:id
 * @access private
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userIdToDelete } = req.params;
    const { id: loggedInUserId } = req.user;

    const user = await User.findById(userIdToDelete).lean();

    if (!user) {
      res.status(NOT_FOUND);
      throw Error("User not found");
    }

    if (loggedInUserId !== user._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    await User.findByIdAndDelete(loggedInUserId);

    return res.status(OK).json({
      success: true,
      message: "User deleted"
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
