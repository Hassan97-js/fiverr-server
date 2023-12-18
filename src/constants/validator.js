import mongoose from "mongoose";
import { body, check, param, query } from "express-validator";

import { getObjectIdValidator } from "../utils/get-objectId-validator.js";

export const createGigValidation = [
  body("title").notEmpty().withMessage("Title is required").escape(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .escape(),
  body("category").notEmpty().withMessage("Category is required").escape(),
  body("price").notEmpty().withMessage("Price is required").escape(),
  body("coverImage").notEmpty().withMessage("Cover image is required").escape(),
  body("shortTitle").notEmpty().withMessage("Short title is required").escape(),
  body("shortDescription")
    .notEmpty()
    .withMessage("Short description is required")
    .escape(),
  body("deliveryTime")
    .notEmpty()
    .withMessage("Delivery time is required")
    .escape(),
  body("revisionNumber")
    .notEmpty()
    .withMessage("Revision number is required")
    .escape(),
];

export const getPublicGigsValidation = [
  query("search").trim().toLowerCase().escape().optional(),
  query("min").trim().escape().optional(),
  query("max").trim().escape().optional(),
  query("sort").trim().toLowerCase().escape().optional(),
];

export const signUpValidation = [
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 4, max: 30 })
    .withMessage("Must be at least 8 chars long and max 30 chars"),
];

export const signInValidation = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("password").not().notEmpty().withMessage("Password is required"),
];

export const checkObjectIdValidator = getObjectIdValidator();

export const getConversationValidator = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("Conversation ID is required")
    .trim()
    .escape(),
];

export const createConversationValidator = [
  body("messageToId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID"),
];

export const updateConversationValidator = [
  body("id")
    .not()
    .isEmpty()
    .withMessage("Conversation ID is required")
    .trim()
    .escape(),
];

export const getMessagesValidator = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("Conversation ID is required")
    .trim()
    .escape(),
];

export const createMessageValidator = [
  body("conversationId")
    .not()
    .isEmpty()
    .withMessage("Conversation ID is required")
    .trim()
    .escape(),
  body("text").not().isEmpty().withMessage("Text is required").trim().escape(),
];

export const getReviewsValidator = [
  param("gigId")
    .not()
    .isEmpty()
    .withMessage("Gig ID is required")
    .trim()
    .escape(),
];

export const createReviewValidator = [
  body("gigId")
    .not()
    .isEmpty()
    .withMessage("Gig ID is required")
    .trim()
    .escape(),
  body("description")
    .not()
    .isEmpty()
    .withMessage("Description is required")
    .trim()
    .escape(),
  body("starNumber").isNumeric().withMessage("Star number must be a number"),
];

export const deleteReviewValidator = [
  param("gigId")
    .not()
    .isEmpty()
    .withMessage("Gig ID is required")
    .trim()
    .escape(),
];
