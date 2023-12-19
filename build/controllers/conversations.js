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
exports.createConversation = exports.updateConversation = exports.getConversation = exports.getConversations = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const conversation_js_1 = __importDefault(require("../models/conversation.js"));
const http_js_1 = require("../constants/http.js");
const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get all private conversations
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations
 * @access private
 */
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isSeller, id: userId } = req.user;
        const converations = yield conversation_js_1.default.find(Object.assign(Object.assign({}, (isSeller ? { sellerId: userId } : { buyerId: userId })), { fetchId: { $regex: userId } }))
            .sort({
            updatedAt: -1,
        })
            .populate("sellerId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ])
            .populate("buyerId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ])
            .lean();
        return res.status(OK).json({ success: true, converations });
    }
    catch (error) {
        next(error);
    }
});
exports.getConversations = getConversations;
/**
 * @desc Get a single conversation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single/:id
 * @access private
 */
const getConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id: conversationId } = req.params;
        if (!conversationId.includes(user.id)) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        const conversation = yield conversation_js_1.default.findOne({ fetchId: conversationId })
            .populate("sellerId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ])
            .populate("buyerId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ])
            .lean();
        if (!conversation) {
            res.status(NOT_FOUND);
            throw Error("Conversation not found");
        }
        return res.status(OK).json({
            succcess: true,
            conversation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getConversation = getConversation;
/**
 * @desc Update a single conversation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single
 * @access private
 */
const updateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const conversationId = req.body.id;
        if (!conversationId.includes(user.id)) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        const updatedConversation = yield conversation_js_1.default.findOneAndUpdate({ fetchId: conversationId }, {
            $set: {
                readBySeller: true,
                readByBuyer: true,
            },
        }, { new: true }).lean();
        if (!updatedConversation) {
            res.status(FORBIDDEN);
            throw Error("Error updating conversation");
        }
        return res.status(OK).json({
            success: true,
            conversation: updatedConversation,
            message: "Conversation updated",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateConversation = updateConversation;
/**
 * @desc Create a single converation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single
 * @access private
 */
const createConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isSeller, id: userId } = req.user;
        const messageToId = req.body.messageToId;
        if (messageToId === userId) {
            res.status(FORBIDDEN);
            throw Error("Forbidden");
        }
        const user = yield user_js_1.default.findById(messageToId).lean();
        if (isSeller && user.isSeller) {
            res.status(FORBIDDEN);
            throw Error("Seller is not allowed to create a conversation with another seller");
        }
        if (!isSeller && !user.isSeller) {
            res.status(FORBIDDEN);
            throw Error("Client is not allowed to create a conversation with another client");
        }
        const conversation = yield conversation_js_1.default.findOne({
            fetchId: isSeller ? userId + messageToId : messageToId + userId,
        });
        if (conversation) {
            return res.status(CREATED).json({ succcess: true, conversation });
        }
        const newConversation = yield conversation_js_1.default.create({
            fetchId: isSeller ? userId + messageToId : messageToId + userId,
            sellerId: isSeller ? userId : messageToId,
            buyerId: isSeller ? messageToId : userId,
            readBySeller: !!isSeller,
            readByBuyer: !isSeller,
        });
        return res
            .status(CREATED)
            .json({ succcess: true, conversation: newConversation });
    }
    catch (error) {
        next(error);
    }
});
exports.createConversation = createConversation;
