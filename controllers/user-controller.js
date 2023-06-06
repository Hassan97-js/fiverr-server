import { User } from "../models/index.js";

/** 
  @desc Delete user account by id
  @route /api/user/:id
  @access public
*/
async function deleteUser(req, res, next) {
  try {
    const { id: paramsId } = req.params;

    if (!paramsId) {
      res.status(401);
      throw Error("No user ID was provided.");
    }

    const dbUser = await User.findById(paramsId);

    if (!dbUser) {
      res.status(404);
      throw Error("No user with ID was found!");
    }

    const { id: payloadId } = req.userAuth;

    if (payloadId !== dbUser._id.toString()) {
      res.status(403);
      throw Error("You can only delete your account!");
    }

    await User.findByIdAndDelete(payloadId);

    return res.status(200).send({
      message: "You have deleted your account!"
    });
  } catch (error) {
    next(error);
  }
}

export { deleteUser };
