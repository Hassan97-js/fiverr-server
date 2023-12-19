"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const http_js_1 = require("../constants/http.js");
const logger_js_1 = require("../constants/logger.js");
const { VALIDATION_ERROR, OK, UNAUTHORIZED, CREATED, NOT_FOUND, FORBIDDEN, SERVER_ERROR, } = http_js_1.httpsCodes;
/**
 * @desc  Catch not found error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const notFoundHandler = (req, res, next) => {
    try {
        const { originalUrl: fullURL } = req;
        const sliceStartIndex = fullURL.lastIndexOf("/") + 1;
        const notFoundRoute = fullURL.slice(sliceStartIndex);
        const { NOT_FOUND } = http_js_1.httpsCodes;
        logger_js_1.logger.error(`"${notFoundRoute}" page not found.`);
        return res
            .status(NOT_FOUND)
            .json({ message: `"${notFoundRoute}" page not found.` });
    }
    catch (error) {
        next(error);
    }
};
exports.notFoundHandler = notFoundHandler;
/**
 * @desc  Catch any error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const errorHandler = (error, req, res, next) => {
    if (!res.statusCode || res.statusCode === OK) {
        res.statusCode = SERVER_ERROR;
    }
    if (!(error === null || error === void 0 ? void 0 : error.message)) {
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
            logger_js_1.logger.info("All good!");
            break;
    }
    logger_js_1.logger.error(error === null || error === void 0 ? void 0 : error.message);
    return res.json(errorResponse);
};
exports.errorHandler = errorHandler;
