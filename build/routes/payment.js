"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_js_1 = require("../controllers/payment.js");
const verify_js_1 = require("../middlewares/verify.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.post("/create-payment-intent", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.createPaymentIntentValidator), payment_js_1.createPaymentIntent);
exports.default = router;
