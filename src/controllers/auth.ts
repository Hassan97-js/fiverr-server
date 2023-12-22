import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";

import BlackList from "../models/black-list";
import User from "../models/user";

import { generateJWT } from "../utils/jwt";
import { getAccessToken } from "../utils/get-token";

import { httpsCodes } from "../constants/http";

const { OK, CREATED, FORBIDDEN, VALIDATION_ERROR, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/auth/sign-up
 * @access public
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const isUserExists = await User.exists({ username }).lean();

    if (isUserExists) {
      res.status(FORBIDDEN);
      throw Error("Email is already exists");
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
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};

/**
 * @route /api/auth/sign-in
 * @access public
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password: sentPassword } = req.body;

    const user = await User.findOne({ username }).select("+password").lean();

    if (!user) {
      res.status(VALIDATION_ERROR);
      throw Error("Wrong password or username");
    }

    const isCorrectPassword = await bcrypt.compare(sentPassword, user.password);

    if (!isCorrectPassword) {
      res.status(UNAUTHORIZED);
      throw Error("Wrong password or username");
    }

    const { password, createdAt, updatedAt, _id, phone, description, ...rest } =
      user;
    const userToSend = { id: _id, ...rest };

    const token = generateJWT({
      payload: {
        id: userToSend.id,
        username: userToSend.username,
        email: userToSend.email,
        isSeller: userToSend.isSeller,
        image: userToSend.image
      },
      expiresIn: "2 days"
    });

    if (!token) {
      res.status(500);
      throw Error("Could not generate access token");
    }

    const payloadToSend = {
      success: true,
      token,
      user: userToSend,
      message: "You have successfully logged in"
    };

    res.status(OK).json(payloadToSend);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};

/**
 * @route /api/auth/sign-out
 * @access private
 */
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAccessToken(req);

    if (!token) {
      res.status(UNAUTHORIZED);
      throw Error("Invalid token");
    }

    await BlackList.create({
      token
    });

    return res.status(OK).json({
      success: true,
      message: "Log out successful"
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};
