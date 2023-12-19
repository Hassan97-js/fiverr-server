"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
/**
 * @desc Gets an access token from headers
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getAccessToken = (req) => {
    try {
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return null;
        }
        const token = authHeader.split(" ")[1];
        return token;
    }
    catch (error) {
        return null;
    }
};
exports.getAccessToken = getAccessToken;
