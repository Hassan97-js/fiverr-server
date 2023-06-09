import { User } from "../models/index.js";

import constants from "../constants.js";

/** 
  @desc Get a user 
  @route /api/users/:id
  @access private
*/
async function getUser(req, res, next) {
  try {
    const { id: paramsId } = req.params;

    const { OK, NOT_FOUND } = constants.httpCodes;

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("No user with this ID was found!");
    }

    return res.status(OK).json(dbUser);
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Delete a user 
  @route /api/users/:id
  @access private
*/
async function deleteUser(req, res, next) {
  try {
    const { id: paramsId } = req.params;

    const { OK, NOT_FOUND, UNAUTHORIZED } = constants.httpCodes;

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("No user with this ID was found!");
    }

    const { id: jwtUserId } = req.userAuth;

    if (jwtUserId !== dbUser._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("You can only delete your account!");
    }

    await User.findByIdAndDelete(jwtUserId);

    return res.status(OK).json({
      message: "You have deleted your account!"
    });
  } catch (error) {
    next(error);
  }
}

export { getUser, deleteUser };
