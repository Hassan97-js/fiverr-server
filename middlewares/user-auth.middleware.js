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
  try {
    let accessToken;

    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      accessToken = authHeader.split(" ")[1];

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
          res.status(UNAUTHORIZED);
          throw Error("User is not authorized!");
        }

        req.user = decoded.user;
      });

      next();
    } else {
      res.status(UNAUTHORIZED);
      throw Error("Token is not valid or missing!");
    }
  } catch (error) {
    next(error);
  }
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
      res.status(FORBIDDEN);
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
