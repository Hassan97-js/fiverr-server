function createNewError(statusCode = 500, message = "Something went wrong!") {
  if (typeof statusCode !== "number" || typeof message !== "string") {
    throw Error(
      "statusCode argument must be a number and message argument must be a string"
    );
  }

  return {
    message,
    statusCode
  };
}

export { createNewError };
