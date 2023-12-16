import { validationResult } from "express-validator";

import { httpsCodes } from "../constants.js";

const { FORBIDDEN } = httpsCodes;

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
        const responseError = {};

        validationErrors.array().map((error) => {
          responseError[error.path] = error.msg;
          responseError.value = error.value;

          return responseError;
        });

        return res.status(FORBIDDEN).json({ error: responseError });
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};
