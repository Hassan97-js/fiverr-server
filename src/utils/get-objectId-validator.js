import mongoose from "mongoose";
import { check } from "express-validator";

/**
 * Validates if id is an ObjectId type
 * @param {string} id - The id to be validated
 */
export const getObjectIdValidator = (id = "id") => {
  if (!id || typeof id !== "string") {
    return [];
  }

  return [
    check(id)
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .trim()
      .withMessage("Invalid ID"),
  ];
};
