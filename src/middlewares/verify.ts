import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import BlackList from "../models/black-list";

import { SECRET_ACCESS_TOKEN } from "../config/index";
import { getAccessToken } from "../utils/get-token";
import { httpsCodes } from "../constants/http";
import type { TJwtUser, TUser } from "../types/user";

const { UNAUTHORIZED } = httpsCodes;

/**
 * Verify user id with jwt token
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    jwt.verify(token, SECRET_ACCESS_TOKEN!, (error, decoded) => {
      if (error) {
        res.status(UNAUTHORIZED);
        throw Error("Invalid token");
      }

      console.log(typeof decoded);

      if (!decoded || typeof decoded !== "object" || !("username" in decoded)) {
        res.status(UNAUTHORIZED);
        throw Error("Invalid token");
      }

      if (typeof decoded === "string") {
        const parsedUser = JSON.parse(decoded) as TJwtUser;

        const currentUser = {
          id: parsedUser?.id,
          username: parsedUser?.username,
          email: parsedUser?.email,
          isSeller: parsedUser?.isSeller,
        };

        req.user = currentUser;
      }
    });

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};
