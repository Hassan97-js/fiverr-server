import { type Request, type Response, type NextFunction } from "express";
import { type ValidationChain, validationResult } from "express-validator";

import { httpsCodes } from "../constants/http";

const { FORBIDDEN } = httpsCodes;

export const validate = (validations: ValidationChain[]) => {
  if (!validations || !Array.isArray(validations)) {
    throw Error("Invalid parameter");
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const v of validations) {
        const result = await v.run(req);

        if (!result.isEmpty()) {
          break;
        }
      }

      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        const errors = validationErrors.mapped();

        return res.status(FORBIDDEN).json({ errors });
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};
