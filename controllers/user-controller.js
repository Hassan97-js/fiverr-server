import { User } from "../models/index.js";

async function deleteUser(req, res) {
  const { id: paramsId } = req.params;

  const dbUser = await User.findById(paramsId);

  if (!dbUser) {
    return res.status(404).send("No user with ID was found!");
  }

  const { id: payloadId } = req.userAuth;
  if (payloadId !== dbUser._id.toString()) {
    return res.status(403).send("You can only delete your account!");
  }

  await User.findByIdAndDelete(payloadId);

  return res.status(200).send("You have deleted your account!");
}

export { deleteUser };
