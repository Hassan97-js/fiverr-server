import { Request } from "express";

/**
 * Gets an access token from request header
 */
export const getAccessToken = (req: Request) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (typeof authHeader !== "string") {
      return null;
    }

    if (!authHeader || !authHeader?.startsWith("Bearer")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    return token;
  } catch (error) {
    return null;
  }
};
