import { Request } from "express";

/**
 * Gets an access token from request header
 */
export const getAccessToken = (req: Request) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (
      !authHeader ||
      (typeof authHeader === "string" && !authHeader?.startsWith("Bearer"))
    ) {
      return null;
    }

    if (typeof authHeader === "string") {
      const token = authHeader.split(" ")[1];
      return token;
    }

    return null;
  } catch (error) {
    return null;
  }
};
