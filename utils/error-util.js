function createNewError(
  message = "Something went wrong!",
  stackTrace = null
) {
  if (typeof message !== "string") {
    throw Error(
      "message argument must be a string"
    );
  }

  return {
    message,
    stackTrace
  };
}

export { createNewError };
