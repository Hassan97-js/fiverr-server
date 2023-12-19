"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const black_list_js_1 = __importDefault(require("../models/black-list.js"));
const index_js_1 = require("../config/index.js");
const get_token_js_1 = require("../utils/get-token.js");
const http_js_1 = require("../constants/http.js");
const { UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Verify user id via jwt token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, get_token_js_1.getAccessToken)(req);
        if (!token) {
            res.status(UNAUTHORIZED);
            throw Error("Invalid token");
        }
        const isBlacklisted = !!(yield black_list_js_1.default.findOne({ token }));
        if (isBlacklisted) {
            res.status(UNAUTHORIZED);
            throw Error("You are not authorized [BlackListed]");
        }
        jsonwebtoken_1.default.verify(token, index_js_1.SECRET_ACCESS_TOKEN, (error, decoded) => {
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
    }
    catch (error) {
        next(error);
    }
});
exports.verifyToken = verifyToken;
