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
    next(error);
  }
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  if (!error?.message) {
    error.message = "Internal Server Error";
  }

  const isSuccess = res.statusCode === OK || res.statusCode === CREATED;

  const errorResponse = {
    title: "Error",
    message: error.message,
    success: isSuccess ? true : false,
    stackTrace: NODE_ENV === "development" ? error.stack : undefined,
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

  logger.error(error?.message);

  return res.json(errorResponse);
};
