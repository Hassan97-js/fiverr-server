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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const black_list_js_1 = __importDefault(require("../models/black-list.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
const jwt_js_1 = require("../utils/jwt.js");
const get_token_js_1 = require("../utils/get-token.js");
const http_js_1 = require("../constants/http.js");
const { OK, CREATED, FORBIDDEN, VALIDATION_ERROR, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Sign up user and save in DB
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signup
 * @access public
 */
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password } = req.body;
        const isUserExists = yield user_js_1.default.exists({ username }).lean();
        if (isUserExists) {
            res.status(FORBIDDEN);
            throw Error("Email is already exists");
        }
        const saltRounds = 10;
        const hash = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = yield user_js_1.default.create(Object.assign(Object.assign({}, req.body), { password: hash }));
        res.status(CREATED).json({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            isSeller: newUser.isSeller,
            country: newUser.country,
            image: (_a = newUser.image) !== null && _a !== void 0 ? _a : "",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
/**
 * @desc Sign in user with jwt
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signin
 * @access public
 */
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password: sentPassword } = req.body;
        const user = yield user_js_1.default.findOne({ username }).select("+password").lean();
        if (!user) {
            res.status(VALIDATION_ERROR);
            throw Error("Wrong password or username");
        }
        const isCorrectPassword = yield bcrypt_1.default.compare(sentPassword, user.password);
        if (!isCorrectPassword) {
            res.status(UNAUTHORIZED);
            throw Error("Wrong password or username");
        }
        const { password } = user, rest = __rest(user, ["password"]);
        const userToSend = rest;
        const token = (0, jwt_js_1.generateJWT)({
            payload: {
                id: userToSend._id,
                username: userToSend.username,
                email: userToSend.email,
                isSeller: userToSend.isSeller,
            },
            expiresIn: "2 days",
        });
        if (!token) {
            res.status(500);
            throw Error("Could not generate access token");
        }
        const payloadToSend = {
            success: true,
            token,
            user: userToSend,
            message: "You have successfully logged in",
        };
        res.status(OK).json(payloadToSend);
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
/**
 * @desc Sign out user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/auth/signout
 * @access private
 */
const signOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, get_token_js_1.getAccessToken)(req);
        if (!token) {
            res.status(UNAUTHORIZED);
            throw Error("Invalid token");
        }
        yield black_list_js_1.default.create({
            token,
        });
        return res.status(OK).json({
            success: true,
            message: "Log out successful",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signOut = signOut;
