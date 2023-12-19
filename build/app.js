"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winston_1 = require("winston");
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const user_1 = __importDefault(require("./routes/user"));
const conversations_1 = __importDefault(require("./routes/conversations"));
const gigs_1 = __importDefault(require("./routes/gigs"));
const messages_1 = __importDefault(require("./routes/messages"));
const orders_1 = __importDefault(require("./routes/orders"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const auth_1 = __importDefault(require("./routes/auth"));
const payment_1 = __importDefault(require("./routes/payment"));
const catch_error_1 = require("./middlewares/catch-error");
const logger_1 = require("./constants/logger");
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== "production") {
    logger_1.logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
}
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/user", user_1.default);
app.use("/api/gigs", gigs_1.default);
app.use("/api/reviews", reviews_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/conversations", conversations_1.default);
app.use("/api/messages", messages_1.default);
app.use("/api/payment", payment_1.default);
app.use("*", catch_error_1.notFoundHandler);
app.use("*", catch_error_1.errorHandler);
exports.default = app;
