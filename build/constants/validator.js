"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntentValidator = exports.confirmOrderValidator = exports.deleteReviewValidator = exports.createReviewValidator = exports.getReviewsValidator = exports.createMessageValidator = exports.getMessagesValidator = exports.updateConversationValidator = exports.createConversationValidator = exports.getConversationValidator = exports.checkObjectIdValidator = exports.signInValidation = exports.signUpValidation = exports.getPublicGigsValidation = exports.createGigValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
const get_objectId_validator_js_1 = require("../utils/get-objectId-validator.js");
exports.createGigValidation = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required").escape(),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required")
        .escape(),
    (0, express_validator_1.body)("category").notEmpty().withMessage("Category is required").escape(),
    (0, express_validator_1.body)("price").notEmpty().withMessage("Price is required").escape(),
    (0, express_validator_1.body)("coverImage").notEmpty().withMessage("Cover image is required").escape(),
    (0, express_validator_1.body)("shortTitle").notEmpty().withMessage("Short title is required").escape(),
    (0, express_validator_1.body)("shortDescription")
        .notEmpty()
        .withMessage("Short description is required")
        .escape(),
    (0, express_validator_1.body)("deliveryTime")
        .notEmpty()
        .withMessage("Delivery time is required")
        .escape(),
    (0, express_validator_1.body)("revisionNumber")
        .notEmpty()
        .withMessage("Revision number is required")
        .escape(),
];
exports.getPublicGigsValidation = [
    (0, express_validator_1.query)("search").trim().toLowerCase().escape().optional(),
    (0, express_validator_1.query)("min").trim().escape().optional(),
    (0, express_validator_1.query)("max").trim().escape().optional(),
    (0, express_validator_1.query)("sort").trim().toLowerCase().escape().optional(),
];
exports.signUpValidation = [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.check)("username")
        .not()
        .isEmpty()
        .withMessage("Username is required")
        .trim()
        .escape(),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .isLength({ min: 4, max: 30 })
        .withMessage("Must be at least 8 chars long and max 30 chars"),
];
exports.signInValidation = [
    (0, express_validator_1.check)("username")
        .not()
        .isEmpty()
        .withMessage("Username is required")
        .trim()
        .escape(),
    (0, express_validator_1.check)("password").not().notEmpty().withMessage("Password is required"),
];
exports.checkObjectIdValidator = (0, get_objectId_validator_js_1.getObjectIdValidator)();
exports.getConversationValidator = [
    (0, express_validator_1.param)("id")
        .not()
        .isEmpty()
        .withMessage("Conversation ID is required")
        .trim()
        .escape(),
];
exports.createConversationValidator = [
    (0, express_validator_1.body)("messageToId")
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage("Invalid ID"),
];
exports.updateConversationValidator = [
    (0, express_validator_1.body)("id")
        .not()
        .isEmpty()
        .withMessage("Conversation ID is required")
        .trim()
        .escape(),
];
exports.getMessagesValidator = [
    (0, express_validator_1.param)("id")
        .not()
        .isEmpty()
        .withMessage("Conversation ID is required")
        .trim()
        .escape(),
];
exports.createMessageValidator = [
    (0, express_validator_1.body)("conversationId")
        .not()
        .isEmpty()
        .withMessage("Conversation ID is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("text").not().isEmpty().withMessage("Text is required").trim().escape(),
];
exports.getReviewsValidator = [
    (0, express_validator_1.param)("gigId")
        .not()
        .isEmpty()
        .withMessage("Gig ID is required")
        .trim()
        .escape(),
];
exports.createReviewValidator = [
    (0, express_validator_1.body)("gigId")
        .not()
        .isEmpty()
        .withMessage("Gig ID is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("description")
        .not()
        .isEmpty()
        .withMessage("Description is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("starNumber").isNumeric().withMessage("Star number must be a number"),
];
exports.deleteReviewValidator = [
    (0, express_validator_1.param)("gigId")
        .not()
        .isEmpty()
        .withMessage("Gig ID is required")
        .trim()
        .escape(),
];
exports.confirmOrderValidator = [
    (0, express_validator_1.body)("paymentIntent")
        .not()
        .isEmpty()
        .withMessage("Payment intent is required")
        .trim()
        .escape(),
];
exports.createPaymentIntentValidator = [
    (0, express_validator_1.body)("gigId")
        .not()
        .isEmpty()
        .withMessage("Gig ID is required")
        .trim()
        .escape(),
];
