import { User } from "../models/index.js";

import constants from "../constants.js";

/** 
  @desc Delete user account by id
  @route /api/user/:id
  @access public
*/
async function deleteUser(req, res, next) {
  try {
    const { id: paramsId } = req.params;

    const { UNAUTHORIZED, FORBIDDEN, NOT_FOUND } = constants.errorCodes;

    if (!paramsId) {
      res.status(UNAUTHORIZED);
      throw Error("No user ID was provided.");
    }

    if (paramsId.length > 24) {
      res.status(FORBIDDEN);
      throw Error(
        "User ID must be 12 bytes or a string of 24 hex characters or an integer"
      );
    }

    const dbUser = await User.findById(paramsId).lean();

    if (!dbUser) {
      res.status(NOT_FOUND);
      throw Error("No user with ID was found!");
    }

    const { id: jwtUserId } = req.userAuth;

    if (jwtUserId !== dbUser._id.toString()) {
      res.status(UNAUTHORIZED);
      throw Error("You can only delete your account!");
    }

    await User.findByIdAndDelete(jwtUserId);

    return res.status(200).send({
      message: "You have deleted your account!"
    });
  } catch (error) {
    next(error);
  }
}

export { deleteUser };
