import constants from "../constants.js";

export const createNewError = (
  statusCode = 500,
  message = "Something went wrong!",
  stackTrace = null
) => {
  if (typeof message !== "string") {
    throw Error("message argument must be a string");
  }

  const { FORBIDDEN, NOT_FOUND, UNAUTHORIZED, VALIDATION_ERROR, SERVER_ERROR } =
    constants.httpCodes;

  const errorResponse = {
    title: null,
    message,
    stackTrace
  };

  switch (statusCode) {
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
      errorResponse.title = "Server Error";
      break;
    default:
      console.log("No Error");
      break;
  }

  return errorResponse;
};
