import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";

import constants from "../constants.js";

/** 
  @desc Register user and save in DB
  @route /api/auth/register
  @access public
*/
async function registerUser(req, res, next) {
  try {
    const { username, email, password, country } = req.body;

    const { FORBIDDEN, VALIDATION_ERROR } = constants.errorCodes;

    if (!username || !email || !password || !country) {
      res.status(VALIDATION_ERROR);
      throw Error("All fields are mandatory!");
    }

    const foundUser = await User.findOne({ $or: [{ username }, { email }] }).lean();

    if (foundUser) {
      res.status(FORBIDDEN);
      throw Error("The username and email fields must be unique!");
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = User({
      ...req.body,
      password: hash
    });

    await newUser.save();

    res.status(201).json({
      message: "User has been created."
    });
  } catch (error) {
    next(error);
  }
}

/** 
  @desc Login user with jsonwebtoken
  @route /api/auth/login
  @access public
*/
async function loginUser(req, res, next) {
  try {
    const { username, password: sentPassword } = req.body;

    const { NOT_FOUND, VALIDATION_ERROR } = constants.errorCodes;

    if (!username || !sentPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("All fields are mandatory!");
    }

    // lean is great for high-performance,
    // read-only cases, especially when combined
    // with cursors.
    const foundUser = await User.findOne({ username }).lean();

    if (!foundUser) {
      res.status(NOT_FOUND);
      throw Error("User not found!");
    }

    const isCorrectPassword = await bcrypt.compare(sentPassword, foundUser.password);

    if (!isCorrectPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username!");
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
      .json({
        ...foundUser,
        password: null,
        message: "User has been logged in."
      });
  } catch (error) {
    next(error);
  }
}

/** 
  @desc logout user by clearning cookie
  @route /api/auth/logout
  @access public
*/
async function logoutUser(req, res, next) {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true
      })
      .status(200)
      .json({ message: "User has been logged out!" });
  } catch (error) {
    next(error);
  }
}

export { registerUser, loginUser, logoutUser };
