import { User } from "../models/index.js";

import constants from "../constants.js";

/** 
  @desc Get a user 
  @route /api/user/:id
  @access private
*/
export const getUser = async (req, res, next) => {
  try {
    const { id: paramsId } = req.params;

    const { OK, NOT_FOUND } = constants.httpCodes;

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("User not found!");
    }

    return res.status(OK).json(dbUser);
  } catch (error) {
    next(error);
  }
};

/** 
  @desc Delete a user 
  @route /api/user/:id
  @access private
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

    const { id: jwtUserId } = req.user;

    if (jwtUserId !== dbUser._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("You are not authorized to delete this account!");
    }

    await User.findByIdAndDelete(jwtUserId);

    return res.status(OK).json({
      message: "Account has been deleted!"
    });
  } catch (error) {
    next(error);
  }
};
