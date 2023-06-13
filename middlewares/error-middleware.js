import { createNewError } from "../utils/index.js";

import constants from "../constants.js";

function errorHandler(error, req, res, next) {
  const { SERVER_ERROR, OK } = constants.httpCodes;

  // if the app sent HTTP
  // headers for the response.
  if (res.headersSent) {
    // forward error to
    // the default express
    // error handler
    return next(error);
  }

  if (!res.statusCode || res.statusCode === OK) {
    res.statusCode = SERVER_ERROR;
  }

  if (!error.message) {
    error.message = "Something went wrong!";
  }

  const middlewareJsonError = createNewError(
    res.statusCode,
    error.message,
    error.stack
  );

  return res.json(middlewareJsonError);
}

export { errorHandler };
