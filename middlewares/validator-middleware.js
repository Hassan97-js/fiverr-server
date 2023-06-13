import { validationResult } from "express-validator";

import constants from "../constants.js";

const { VALIDATION_ERROR } = constants.httpCodes;

function validate(validations) {
  return async function (req, res, next) {
    try {
      for (const validation of validations) {
        const result = await validation.run(req);

        if (result.errors.length) {
          break;
        }
      }

      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        res.status(VALIDATION_ERROR);
        throw Error("Express validator: Invalid value");
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

export { validate };
