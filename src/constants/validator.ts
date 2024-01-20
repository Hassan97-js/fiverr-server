import mongoose from "mongoose";
import { body, check, param, query } from "express-validator";

import { getObjectIdValidator } from "../utils/get-objectId-validator";

export const createGigValidation = [
  body("title").notEmpty().withMessage("Title is required").escape(),
  body("description").notEmpty().withMessage("Description is required").escape(),
  body("category").notEmpty().withMessage("Category is required").escape(),
  body("price").notEmpty().withMessage("Price is required").escape(),
  body("coverImage")
    .notEmpty()
    .isURL({
      require_tld: false,
      host_whitelist: [new RegExp("cloudinary")]
    })
    .withMessage("Cover image must be a valid url")
    .trim(),
  body("images")
    .isArray({
      min: 1,
      max: 5
    })
    .withMessage("Gig images must be an array with at least one item and with max 5 items")
    .isURL({
      require_tld: false,
      host_whitelist: [new RegExp("cloudinary")]
    })
    .withMessage("Gig images must be an array with valid urls")
    .trim(),

  body("shortTitle").notEmpty().withMessage("Short title is required").escape(),
  body("shortDescription").notEmpty().withMessage("Short description is required").escape(),
  body("deliveryTime").notEmpty().withMessage("Delivery time is required").escape(),
  body("revisionNumber").notEmpty().withMessage("Revision number is required").escape()
];

export const getPublicGigsValidation = [
  query("search").trim().toLowerCase().escape().optional(),
  query("min").trim().escape().optional(),
  query("max").trim().escape().optional(),
  query("sortBy").trim().toLowerCase().escape().optional()
];

export const signUpValidation = [
  body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("username").notEmpty().withMessage("Username is required").trim().escape(),
  body("password")
    .notEmpty()
    .isLength({ min: 4, max: 30 })
    .withMessage("Must be at least 4 chars long and max 30 chars"),
  body("country").notEmpty().withMessage("Country is required").trim().escape(),
  body("image")
    .notEmpty()
    .isURL({
      require_tld: false,
      host_whitelist: [new RegExp("cloudinary")]
    })
    .withMessage("Profile image must be a valid url")
    .trim()
    .optional()
];

export const signInValidation = [
  check("username").notEmpty().withMessage("Username is required").trim().escape(),
  check("password").notEmpty().withMessage("Password is required").trim()
];

export const checkObjectIdValidator = getObjectIdValidator();

export const getChatValidator = [
  param("id").notEmpty().isLength({ min: 1, max: 49 }).withMessage("Chat ID must be 49 characters").trim().escape()
];

export const createChatValidator = [
  body("receiverId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID")
];

export const updateChatValidator = [
  body("id").notEmpty().isLength({ min: 1, max: 49 }).withMessage("Chat ID must be 49 characters").trim().escape()
];

export const getChatMessagesValidator = [
  param("id").notEmpty().isLength({ min: 1, max: 49 }).withMessage("Chat ID must be 49 characters").trim().escape()
];

export const createMessageValidator = [
  body("chatId").notEmpty().isLength({ min: 1, max: 49 }).withMessage("Chat ID must be 49 characters").trim().escape(),
  body("text")
    .notEmpty()
    .isLength({ min: 1, max: 3000 })
    .withMessage("Text message must be max 3000 characters")
    .trim()
    .escape()
];

export const getReviewsValidator = [
  param("gigId")
    .notEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Gig ID")
    .trim()
    .escape()
];

export const createReviewValidator = [
  body("gigId")
    .notEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Gig ID")
    .trim()
    .escape(),
  body("description").notEmpty().withMessage("Description is required").trim().escape(),
  body("rating")
    .isInt({
      min: 1,
      max: 5
    })
    .withMessage("Star number must be a number")
];

export const deleteReviewValidator = [
  param("gigId")
    .notEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Gig ID")
    .trim()
    .escape(),
  query("decrementRatings")
    .isInt({
      min: 1,
      max: 5
    })
    .withMessage("decrementRatings is required")
];

export const confirmOrderValidator = [
  body("paymentIntent").notEmpty().withMessage("Payment intent is required").trim().escape()
];

export const createPaymentIntentValidator = [
  body("gigId")
    .notEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Gig ID")
    .trim()
    .escape()
];
