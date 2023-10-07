import { createNewError } from "../utils/index.js";

import constants from "../constants.js";

export const notFoundHandler = (req, res, next) => {
  const { originalUrl: fullURL } = req;

  const sliceStartIndex = fullURL.lastIndexOf("/") + 1;
  const notFoundRoute = fullURL.slice(sliceStartIndex);

  const { NOT_FOUND } = constants.httpCodes;

  res.status(NOT_FOUND).json({ message: `"${notFoundRoute}" page not found.` });
};

export const errorHandler = (error, req, res, next) => {
  const { SERVER_ERROR, OK } = constants.httpCodes;

  // if the app sent HTTP
  // headers for the response.
  // forward error to
  // the default express
  // error handler
  // if (res.headersSent) {
  //   return next(error);
  // }

  if (!res.statusCode || res.statusCode === OK) {
    res.statusCode = SERVER_ERROR;
  }

  !error.message && (error.message = "Something went wrong!");

  const middlewareError = createNewError(res.statusCode, error.message, error.stack);

  return res.json(middlewareError);
};
