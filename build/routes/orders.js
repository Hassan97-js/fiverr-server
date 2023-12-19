"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_js_1 = require("../controllers/orders.js");
const verify_js_1 = require("../middlewares/verify.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.get("/", verify_js_1.verifyToken, orders_js_1.getOrders);
router.put("/single", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.confirmOrderValidator), orders_js_1.confirmOrder);
exports.default = router;
