import { User } from "../models/index.js";

async function deleteUser(req, res) {
  const { id: paramsId } = req.params;

  const dbUser = await User.findById(paramsId);

  if (!dbUser) {
    return res.status(404).send({
      message: "No user with ID was found!",
      statusCode: 404
    });
  }

  const { id: payloadId } = req.userAuth;
  if (payloadId !== dbUser._id.toString()) {
    return res.status(403).send({
      message: "You can only delete your account!",
      statusCode: 403
    });
  }

  await User.findByIdAndDelete(payloadId);

  return res.status(200).send({
    message: "You have deleted your account!",
    statusCode: 200
  });
}

export { deleteUser };
