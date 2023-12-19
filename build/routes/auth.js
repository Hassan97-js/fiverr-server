"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_js_1 = require("../controllers/auth.js");
const validate_js_1 = require("../middlewares/validate.js");
const verify_js_1 = require("../middlewares/verify.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.post("/sign-up", (0, validate_js_1.validate)(validator_js_1.signUpValidation), auth_js_1.signUp);
router.post("/sign-in", (0, validate_js_1.validate)(validator_js_1.signInValidation), auth_js_1.signIn);
router.post("/sign-out", verify_js_1.verifyToken, auth_js_1.signOut);
exports.default = router;
