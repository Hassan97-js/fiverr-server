import { createNewError } from "../utils/index.js";

import constants from "../constants.js";

function errorHandler(error, req, res, next) {
  const { SERVER_ERROR, OK } = constants.httpCodes;

  // if the app sent HTTP
  // headers for the response.
  if (res.headersSent) {
    return next(err);
  }

  if (!res.statusCode || res.statusCode === OK) {
    res.statusCode = SERVER_ERROR;
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
