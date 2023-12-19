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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const http_js_1 = require("../constants/http.js");
const { FORBIDDEN } = http_js_1.httpsCodes;
const validate = (validations) => {
    if (!validations || !Array.isArray(validations)) {
        throw Error("Invalid parameter");
    }
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            for (const v of validations) {
                const result = yield v.run(req);
                if (result.errors.length) {
                    break;
                }
            }
            const validationErrors = (0, express_validator_1.validationResult)(req);
            const errorSource = (_a = validationErrors === null || validationErrors === void 0 ? void 0 : validationErrors.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
            if (!validationErrors.isEmpty()) {
                const responseError = {};
                validationErrors.array().map((error) => {
                    responseError[error.path] = error.msg;
                    responseError.value = error.value;
                    return responseError;
                });
                return res.status(FORBIDDEN).json({ error: responseError });
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.validate = validate;
