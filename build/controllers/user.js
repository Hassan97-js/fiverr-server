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
exports.deleteUser = exports.getUser = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const http_js_1 = require("../constants/http.js");
const { OK, NOT_FOUND, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/user/current
 * @access private
 */
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const user = yield user_js_1.default.findById(userId).lean();
        if (!user) {
            res.status(NOT_FOUND);
            throw Error("User does not exist");
        }
        const userToSend = {
            id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
            isSeller: user.isSeller,
        };
        return res.status(OK).json({
            user: userToSend,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
/**
 * @desc Delete a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/user/:id
 * @access private
 */
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: paramsId } = req.params;
        const user = yield user_js_1.default.findById(paramsId).lean();
        if (!user) {
            res.status(NOT_FOUND);
            throw Error("User not found");
        }
        const { id: loggedInUserId } = req.user;
        if (loggedInUserId !== user._id.toString()) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        yield user_js_1.default.findByIdAndDelete(loggedInUserId);
        return res.status(OK).json({
            success: true,
            message: "User deleted",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
