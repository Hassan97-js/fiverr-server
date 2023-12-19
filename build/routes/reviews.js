"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviews_js_1 = require("../controllers/reviews.js");
const verify_js_1 = require("../middlewares/verify.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.get("/:gigId", (0, validate_js_1.validate)(validator_js_1.getReviewsValidator), reviews_js_1.getReviews);
router.post("/single", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.createReviewValidator), reviews_js_1.createReview);
router.delete("/single/:gigId", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.deleteReviewValidator), reviews_js_1.deleteReview);
exports.default = router;
