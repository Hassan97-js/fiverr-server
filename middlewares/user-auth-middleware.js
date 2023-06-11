import jwt from "jsonwebtoken";

import constants from "../constants.js";

async function verifyToken(req, res, next) {
  try {
    const { accessToken: sentJwtToken } = req.cookies;

    if (!sentJwtToken) {
      res.status(UNAUTHORIZED);
      throw Error("You are not authenticated! (jsonwebtoken is missing).");
    }

    jwt.verify(sentJwtToken, process.env.JWT_KEY, async (error, payload) => {
      if (error) {
        res.status(FORBIDDEN);
        throw Error("Token is not valid!");
      }

      req.userAuth = {
        id: payload.id,
        isSeller: payload.isSeller
      };
    });

    next();
  } catch (error) {
    next(error);
  }
}

async function verifyUserIDValidity(req, res, next) {
  try {
    const paramsId = req.params?.id;

    const { UNAUTHORIZED, FORBIDDEN } = constants.httpCodes;

    if (!paramsId) {
      res.status(UNAUTHORIZED);
      throw Error("No user ID was provided.");
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
}
export { verifyToken, verifyUserIDValidity };
