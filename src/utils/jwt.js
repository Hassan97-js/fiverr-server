import jwt from "jsonwebtoken";

import { SECRET_ACCESS_TOKEN } from "../config/index.js";

/**
 *
 * @returns string
 * */
export const generateJWT = ({ payload = {}, expiresIn = "20m" }) => {
  try {
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn,
    });
  } catch (error) {
    throw Error(error);
  }
};
