import jwt from "jsonwebtoken";

import constants from "../constants.js";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";

const { UNAUTHORIZED, FORBIDDEN, VALIDATION_ERROR } = constants.httpCodes;

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

      jwt.verify(accessToken, SECRET_ACCESS_TOKEN, (error, decoded) => {
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

/**
 * @desc Verify user id via http params
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const verifyGigIDValidity = (req, res, next) => {
  try {
    const paramsGigId = req.params?.id;

    if (!paramsGigId) {
      res.status(VALIDATION_ERROR);
      throw Error("No Gig ID was provided.");
    }

    if (paramsGigId.length > 24) {
      res.status(FORBIDDEN);
      throw Error(
        "Gig ID must be 12 bytes or a string of 24 hex characters or an integer"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
