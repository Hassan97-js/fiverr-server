import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import BlackList from "../models/black-list";

import { SECRET_ACCESS_TOKEN } from "../config/index";
import { getAccessToken } from "../utils/get-token";
import { httpsCodes } from "../constants/http";

const { UNAUTHORIZED } = httpsCodes;

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

      // Todo: Validate with Zod?
      if (!decoded || typeof decoded !== "object" || !("username" in decoded)) {
        res.status(UNAUTHORIZED);
        throw Error("Invalid token");
      }

      const currentUser = {
        id: decoded?.id,
        username: decoded?.username,
        email: decoded?.email,
        isSeller: decoded?.isSeller,
        image: decoded?.image ?? ""
      };

      req.user = currentUser;
    });

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};
