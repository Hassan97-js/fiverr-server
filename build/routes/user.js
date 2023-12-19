"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_js_1 = require("../controllers/user.js");
const verify_js_1 = require("../middlewares/verify.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.get("/current", verify_js_1.verifyToken, user_js_1.getUser);
router.delete("/:id", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.checkObjectIdValidator), user_js_1.deleteUser);
exports.default = router;
