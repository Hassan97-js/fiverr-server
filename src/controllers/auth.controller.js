import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import constants from "../constants.js";

const { OK, CREATED, FORBIDDEN, VALIDATION_ERROR } = constants.httpCodes;

/**
 * @desc Sign up user and save in DB
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signup
 * @access public
 */
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, country } = req.body;

    if (!username || !email || !password || !country) {
      res.status(VALIDATION_ERROR);
      throw Error("All fields are required!");
    }

    const userExists = await User.exists({ $or: [{ username }, { email }] }).lean();

    if (userExists) {
      res.status(FORBIDDEN);
      throw Error("The username and email fields must be unique!");
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      ...req.body,
      password: hash
    });

    res.status(CREATED).json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      isSeller: newUser.isSeller,
      country: newUser.country,
      image: newUser.image ?? ""
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Sign in user with jwt
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signin
 * @access public
 */
export const signin = async (req, res, next) => {
  try {
    const { username, password: signInPassword } = req.body;

    if (!username || !signInPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("All fields are required!");
    }

    const dbUser = await User.findOne({ username }).lean();

    if (!dbUser) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username!");
    }

    const isCorrectPassword = await bcrypt.compare(signInPassword, dbUser.password);

    if (!isCorrectPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username!");
    }

    const accessToken = jwt.sign(
      {
        user: {
          id: dbUser._id.toString(),
          username: dbUser.username,
          isSeller: dbUser.isSeller,
          image: dbUser?.image
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2 days" }
    );

    res.status(OK).json(accessToken);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Sign out user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signout
 * @access public
 */
export const signout = (req, res, next) => {
  // Note: You can use Redis cache to
  // store a blacklist of tokens
  try {
    res.status(OK).json({ message: "Sign out successful!" });
  } catch (error) {
    next(error);
  }
};
