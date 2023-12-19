"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    fetchId: {
        type: String,
        required: true,
        unique: true,
    },
    sellerId: {
        type: String,
        ref: "User",
        required: true,
    },
    buyerId: {
        type: String,
        ref: "User",
        required: true,
    },
    lastMessage: String,
    readBySeller: {
        type: Boolean,
        required: true,
    },
    readByBuyer: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Conversation", conversationSchema);
