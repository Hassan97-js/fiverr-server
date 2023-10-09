import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";

import constants from "../constants.js";

const { OK, CREATED, FORBIDDEN, VALIDATION_ERROR, NOT_FOUND } = constants.httpCodes;

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

    await User.create({
      ...req.body,
      password: hash
    });

    res.status(CREATED).json({
      message: "User has been created!"
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
    const { username, password: signinPassword } = req.body;

    if (!username || !signinPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("All fields are required!");
    }

    // lean is great for high-performance,
    // read-only cases, especially when combined
    // with cursors.
    const dbUser = await User.findOne({ username }).lean();

    if (!dbUser) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username!");
    }

    const isCorrectPassword = bcrypt.compareSync(signinPassword, dbUser.password);

    if (!isCorrectPassword) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username!");
    }

    const jwtTokenSignature = jwt.sign(
      {
        id: dbUser._id,
        imgURL: dbUser.imgURL,
        isSeller: dbUser.isSeller
      },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("accessToken", jwtTokenSignature, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
      maxAge: new Date().getSeconds() + 60 * 60 * 24 * 7 // 1 week
    });

    res.status(OK).json({
      id: dbUser._id.toString(),
      username: dbUser.username,
      isSeller: dbUser.isSeller,
      imgURL: dbUser?.imgURL,
      message: "Sign in successful!"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Sign out user by clearning cookie
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
    res.clearCookie("accessToken", {
      maxAge: 0
    });

    res.status(OK).json({ message: "Sign out successful!" });
  } catch (error) {
    next(error);
  }
};
