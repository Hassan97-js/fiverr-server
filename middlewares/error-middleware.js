import { createNewError } from "../utils/index.js";

function errorHandler(error, req, res, next) {
  const errorMessage = error.message ? error.message : "Something went wrong!";

  const middlewareError = createNewError(errorMessage, error.stack);

  return res.json({
    message: middlewareError.message,
    stackTrace: middlewareError.stackTrace
  });
}

export { errorHandler };
