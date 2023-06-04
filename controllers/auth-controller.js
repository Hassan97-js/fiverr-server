import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { createNewError } from "../utils/index.js";

async function registerUser(req, res, next) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = User({
      ...req.body,
      password: hash
    });

    await newUser.save();

    res.status(201).send({
      message: "User has been created.",
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { username, password: sentPassword } = req.body;

    // lean is great for high-performance,
    // read-only cases, especially when combined
    // with cursors.
    const foundUser = await User.findOne({ username }).lean();

    if (!foundUser) {
      return res.status(404).send({
        message: "User not found!",
        statusCode: 404
      });
    }

    const isCorrectPassword = await bcrypt.compare(sentPassword, foundUser.password);

    if (!isCorrectPassword) {
      return res.status(400).send({
        message: "Wrong password or username!",
        statusCode: 400
      });
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
        password: null,
        message: "User has been logged in.",
        statusCode: 200
      });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res, next) {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true
      })
      .status(200)
      .send(createNewError(200, "User has been logged out."));
  } catch (error) {
    next(error);
  }
}

export { registerUser, loginUser, logoutUser };
