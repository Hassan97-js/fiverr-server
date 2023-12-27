import { type Request, type Response, type NextFunction } from "express";

import { NODE_ENV } from "../config";

import { httpsCodes } from "../constants/http";
import { logger } from "../constants/logger";

import type { ErrorResponse } from "../types/response";

const {
  VALIDATION_ERROR,
  OK,
  UNAUTHORIZED,
  CREATED,
  NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
} = httpsCodes;

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { originalUrl: fullURL } = req;

    const sliceStartIndex = fullURL.lastIndexOf("/") + 1;
    const notFoundRoute = fullURL.slice(sliceStartIndex);

    const error = new Error(`"${notFoundRoute}" page not found`);

    logger.error(`"${notFoundRoute}" page not found`);

    res.status(NOT_FOUND);
    next(error);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  const currentError = typeof error === "string" ? new Error(error) : error;

  if (!currentError.message) {
    currentError.message = "Internal Server Error";
  }

  const isSuccess = res.statusCode === OK || res.statusCode === CREATED;

  const errorResponse = {
    title: "Error",
    message: currentError.message,
    success: isSuccess ? true : false,
    stackTrace: NODE_ENV === "development" ? currentError.stack : undefined,
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
