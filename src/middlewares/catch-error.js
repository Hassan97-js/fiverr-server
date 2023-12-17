import { httpsCodes } from "../constants/http.js";

const {
  VALIDATION_ERROR,
  OK,
  UNAUTHORIZED,
  CREATED,
  NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
} = httpsCodes;

/**
 * @desc  Catch not found error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const notFoundHandler = (req, res, next) => {
  try {
    const { originalUrl: fullURL } = req;

    const sliceStartIndex = fullURL.lastIndexOf("/") + 1;
    const notFoundRoute = fullURL.slice(sliceStartIndex);

    const { NOT_FOUND } = httpsCodes;

    return res
      .status(NOT_FOUND)
      .json({ message: `"${notFoundRoute}" page not found.` });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Catch any error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const errorHandler = (error, req, res, next) => {
  if (!res.statusCode || res.statusCode === OK) {
    res.statusCode = SERVER_ERROR;
  }

  if (!error?.message) {
    error.message = "Internal Server Error";
  }

  const isSuccess = res.statusCode === OK || res.statusCode === CREATED;

  const errorResponse = {
    message: error.message,
    success: isSuccess ? true : false,
    stackTrace: null,
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
      logger.info("All good!");
      break;
  }

  // logger.error(errorResponse?.message);

  return res.json(errorResponse);
};
