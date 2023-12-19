import jwt from "jsonwebtoken";

import BlackList from "../models/black-list";

import { SECRET_ACCESS_TOKEN } from "../config/index";
import { getAccessToken } from "../utils/get-token";
import { httpsCodes } from "../constants/http";

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
        throw Error("Invalid token");
      }

      req.user = decoded;
    });

    next();
  } catch (error) {
    next(error);
  }
};
