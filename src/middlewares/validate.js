import { validationResult } from "express-validator";

import { httpsCodes } from "../constants.js";

const { VALIDATION_ERROR } = httpsCodes;

export const validate = (validations) => {
  if (!validations || !Array.isArray(validations)) {
    throw Error("Invalid parameter");
  }

  return async (req, res, next) => {
    try {
      for (const v of validations) {
        const result = await v.run(req);

        if (result.errors.length) {
          break;
        }
      }

      const validationErrors = validationResult(req);

      const errorSource = validationErrors?.errors[0]?.path;

      if (!validationErrors.isEmpty()) {
        console.log(`Express validator: Invalid value (${errorSource})`);
        res.status(VALIDATION_ERROR);
        throw Error(`Express validator: Invalid value (${errorSource})`);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};
