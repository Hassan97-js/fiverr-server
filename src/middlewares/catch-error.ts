import { type Request, type Response, type NextFunction } from "express";
import Stripe from "stripe";

import { NODE_ENV } from "../config";

import { httpsCodes } from "../constants/http";
import { logger } from "../constants/logger";

import type { ErrorResponse } from "../types/response";

const { VALIDATION_ERROR, UNAUTHORIZED, NOT_FOUND, FORBIDDEN, SERVER_ERROR } = httpsCodes;

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { originalUrl: fullURL } = req;

    const sliceStartIndex = fullURL.lastIndexOf("/") + 1;
    const notFoundRoute = fullURL.slice(sliceStartIndex);

    const error = new Error(`"${notFoundRoute}" page not found`);

    logger.error(`"${notFoundRoute}" page not found`);

    res.status(NOT_FOUND);
    next(error);
  } catch (error) {
    next(error);
  }
};

export const errorHandler = (error: unknown, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  let currentError: Error = new Error("Internal Server Error");

  if (error instanceof Error) {
    currentError = error;
  }

  if (typeof error === "string") {
    currentError = new Error(error);
  }

  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case "StripeCardError": {
        logger.error(`A payment error occurred: ${error.message}`);
        currentError = new Error(error.message);
        break;
      }
      case "StripeInvalidRequestError": {
        logger.error(`An invalid request occurred: ${error.message}`);
        currentError = new Error(error.message);
        break;
      }

      default: {
        logger.error(`Another problem occurred, maybe unrelated to Stripe: ${error.message}`);
        currentError = new Error(error.message);
      }
    }
  }

  if (!currentError.message) {
    currentError.message = "Internal Server Error";
  }

  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  res.status(statusCode);

  const errorResponse = {
    title: "Internal Server Error",
    message: currentError.message,
    success: false,
    statusCode,
    stackTrace: NODE_ENV === "development" ? currentError.stack : undefined
  };

  switch (res.statusCode) {
    case VALIDATION_ERROR:
      errorResponse.title = "Validation Failed";
      break;
    case NOT_FOUND:
      errorResponse.title = "Not Found";
      break;
    case FORBIDDEN:
      errorResponse.title = "Forbidden";
      break;
    case UNAUTHORIZED:
      errorResponse.title = "Unauthorized";
      break;
    case SERVER_ERROR:
      errorResponse.title = "Internal Server Error";
      break;
    default:
      logger.info("All good");
      break;
  }

  logger.error(errorResponse?.message);

  return res.json(errorResponse);
};
