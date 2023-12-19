"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const db_1 = require("./utils/db");
const logger_1 = require("./constants/logger");
const config_1 = require("./config");
app_js_1.default.listen(config_1.PORT, () => {
    (0, db_1.connectToDB)();
    logger_1.logger.info(`[Server] Running on http://localhost:${config_1.PORT}`);
});
