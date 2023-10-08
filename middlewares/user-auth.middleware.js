import jwt from "jsonwebtoken";

import constants from "../constants.js";

const { UNAUTHORIZED, FORBIDDEN } = constants.httpCodes;

/**
 * @desc Verify user id via jwt token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const verifyToken = (req, res, next) => {
  const accessToken = req.headers.cookie;

  console.log(req.headers.cookie);

  if (!accessToken) {
    res.status(UNAUTHORIZED);
    throw Error("You are not authenticated!");
  }

  jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (error, payload) => {
    if (error) {
      res.status(FORBIDDEN);
      throw Error("Token is not valid!");
    }

    req.userAuth = {
      id: payload.id,
      imgURL: payload.imgURL,
      isSeller: payload.isSeller
    };
  });

  next();
};

/**
 * @desc Verify user id via http params
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const verifyUserID = (req, res, next) => {
  try {
    const paramsId = req.params?.id;

    if (!paramsId) {
      res.status(UNAUTHORIZED);
      throw Error("No user ID was provided!");
    }

    if (paramsId.length > 24) {
      res.status(FORBIDDEN);
      throw Error(
        "User ID must be 12 bytes or a string of 24 hex characters or an integer"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
