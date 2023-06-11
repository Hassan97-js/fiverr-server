import constants from "../constants.js";

const { NOT_FOUND } = constants.httpCodes;

function notFoundHandler(req, res) {
  return res.status(NOT_FOUND).json({
    message: "Not Found!"
  });
}

export { notFoundHandler };
