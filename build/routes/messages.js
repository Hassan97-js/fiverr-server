"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_js_1 = require("../middlewares/verify.js");
const messages_js_1 = require("../controllers/messages.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.use(verify_js_1.verifyToken);
router.get("/:id", (0, validate_js_1.validate)(validator_js_1.getMessagesValidator), messages_js_1.getMessages);
router.post("/single", (0, validate_js_1.validate)(validator_js_1.createMessageValidator), messages_js_1.createMessage);
exports.default = router;
