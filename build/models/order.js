"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    gigId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Gig",
        required: true
    },
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buyerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    payment_intent: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Order", orderSchema);
