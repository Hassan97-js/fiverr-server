"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_js_1 = require("../middlewares/verify.js");
const conversations_js_1 = require("../controllers/conversations.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.use(verify_js_1.verifyToken);
router.get("/", conversations_js_1.getConversations);
router.get("/single/:id", (0, validate_js_1.validate)(validator_js_1.getConversationValidator), conversations_js_1.getConversation);
router.post("/single", (0, validate_js_1.validate)(validator_js_1.createConversationValidator), conversations_js_1.createConversation);
router.put("/single", (0, validate_js_1.validate)(validator_js_1.updateConversationValidator), conversations_js_1.updateConversation);
exports.default = router;
