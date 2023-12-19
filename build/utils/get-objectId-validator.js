"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectIdValidator = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
/**
 * Validates if id is an ObjectId type
 * @param {string} id - The id to be validated
 */
const getObjectIdValidator = (id = "id") => {
    if (!id || typeof id !== "string") {
        return [];
    }
    return [
        (0, express_validator_1.check)(id)
            .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
            .trim()
            .withMessage("Invalid ID"),
    ];
};
exports.getObjectIdValidator = getObjectIdValidator;
