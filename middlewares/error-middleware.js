import { createNewError } from "../utils/index.js";

function errorHandler(error, req, res, next) {
  if (res.statusCode === 200) {
    res.statusCode = 500;
  }

  const middlewareJsonError = createNewError(res.statusCode, error.message, error.stack);

  return res.json(middlewareJsonError);
}

export { errorHandler };
