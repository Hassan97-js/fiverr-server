"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../config/index.js");
/**
 *
 * @returns string
 * */
const generateJWT = ({ payload = {}, expiresIn = "20m" }) => {
    try {
        return jsonwebtoken_1.default.sign(payload, index_js_1.SECRET_ACCESS_TOKEN, {
            expiresIn,
        });
    }
    catch (error) {
        throw Error(error);
    }
};
exports.generateJWT = generateJWT;
