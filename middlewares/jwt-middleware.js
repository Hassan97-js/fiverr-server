import jwt from "jsonwebtoken";

import constants from "../constants.js";

async function verifyToken(req, res, next) {
  try {
    const { id } = req.params;

    const { UNAUTHORIZED, FORBIDDEN } = constants.errorCodes;

    if (!id) {
      res.status(UNAUTHORIZED);
      throw Error("No user ID was provided.");
    }

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

export { verifyToken };
