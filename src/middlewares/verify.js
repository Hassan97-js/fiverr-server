import jwt from "jsonwebtoken";

import BlackList from "../models/black-list.js";

import { httpsCodes } from "../constants.js";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";
import { getAccessToken } from "../utils/get-token.js";

const { UNAUTHORIZED } = httpsCodes;

/**
 * @desc Verify user id via jwt token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const verifyToken = async (req, res, next) => {
  try {
    const token = getAccessToken(req);

    if (!token) {
      res.status(UNAUTHORIZED);
      throw Error("Invalid token");
    }

    const isBlacklisted = !!(await BlackList.findOne({ token }));

    if (isBlacklisted) {
      res.status(UNAUTHORIZED);
      throw Error("You are not authorized [BlackListed]");
    }

    jwt.verify(token, SECRET_ACCESS_TOKEN, (error, decoded) => {
      if (error) {
        res.status(UNAUTHORIZED);
        throw Error("Invalid token");
      }

      if (!decoded.hasOwnProperty("username")) {
        res.status(UNAUTHORIZED);
        throw Error("Invalid token: missing username");
      }

      req.user = decoded;
    });

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
// export const verifyUserID = (req, res, next) => {
//   try {
//     const paramsId = req.params?.id;

//     if (!paramsId) {
//       res.status(FORBIDDEN);
//       throw Error("ID not provided");
//     }

//     if (paramsId.length > 24) {
//       res.status(FORBIDDEN);
//       throw Error(
//         "User ID must be 12 bytes or a string of 24 hex characters or an integer"
//       );
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc Verify user id via http params
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
// export const verifyGigIDValidity = (req, res, next) => {
//   try {
//     const paramsGigId = req.params?.id;

//     if (!paramsGigId) {
//       res.status(VALIDATION_ERROR);
//       throw Error("No Gig ID was provided.");
//     }

//     if (paramsGigId.length > 24) {
//       res.status(FORBIDDEN);
//       throw Error(
//         "Gig ID must be 12 bytes or a string of 24 hex characters or an integer"
//       );
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
