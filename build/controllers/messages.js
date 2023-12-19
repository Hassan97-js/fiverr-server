"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = void 0;
const conversation_js_1 = __importDefault(require("../models/conversation.js"));
const message_js_1 = __importDefault(require("../models/message.js"));
const http_js_1 = require("../constants/http.js");
const { OK, FORBIDDEN, CREATED, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get all messages
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/messages/:id
 * @access private
 */
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const conversationId = req.params.id;
        if (!conversationId.includes(user.id)) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        const messages = yield message_js_1.default.find({
            conversationId,
        })
            .populate("userId", ["username", "email", "image", "country", "isSeller"])
            .lean();
        return res.status(OK).json({ success: true, chatMessages: messages });
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
/* TODO: Continue with creating a message then get messages */
/**
 * @desc Create a single message
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/messages/single
 * @access private
 */
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, isSeller } = req.user;
        const { conversationId, text } = req.body;
        const newMessage = yield message_js_1.default.create({
            conversationId,
            userId,
            text,
        });
        if (!newMessage) {
            res.status(UNAUTHORIZED);
            throw Error("Error creating a message");
        }
        const conversation = yield conversation_js_1.default.findOneAndUpdate({ fetchId: conversationId }, {
            $set: {
                readBySeller: isSeller,
                readByBuyer: !isSeller,
                lastMessage: text,
            },
        }, { new: true });
        if (!conversation) {
            res.status(UNAUTHORIZED);
            throw Error("Error updating a conversation");
        }
        return res.status(CREATED).json({ success: true, chatMessage: newMessage });
    }
    catch (error) {
        next(error);
    }
});
exports.createMessage = createMessage;
