import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";

async function registerUser(req, res) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = User({
      ...req.body,
      password: hash
    });

    await newUser.save();

    res.status(201).send("User has been created.");
  } catch (error) {
    res.status(500).send("Something went wrong");
    throw Error(error.message);
  }
}

async function loginUser(req, res) {
  try {
    const { username, password: sentPassword } = req.body;

    // lean is great for high-performance,
    // read-only cases, especially when combined
    // with cursors.
    const foundUser = await User.findOne({ username }).lean();

    if (!foundUser) {
      return res.status(404).send("User not found!");
    }

    const isCorrectPassword = await bcrypt.compare(sentPassword, foundUser.password);

    if (!isCorrectPassword) {
      return res.status(400).send("Wrong password or username!");
    }

    const jwtToken = jwt.sign(
      {
        id: foundUser._id.toString(),
        isSeller: foundUser.isSeller
      },
      process.env.JWT_KEY
    );

    res
      .cookie("accessToken", jwtToken, {
        httpOnly: true
      })
      .status(200)
      .send({
        ...foundUser,
        password: null
      });
  } catch (error) {
    res.status(500).send("Something went wrong");
    throw Error(error.message);
  }
}

async function logoutUser(req, res) {
  try {
    res.send("logoutUser");
  } catch (error) {
    res.status(500).send("Something went wrong");
    throw Error(error.message);
  }
}

export { registerUser, loginUser, logoutUser };
