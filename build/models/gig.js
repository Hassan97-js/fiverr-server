"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gigSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    starNumber: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 1,
        max: 10000,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    images: [String],
    shortTitle: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    revisionNumber: {
        type: Number,
        required: true,
    },
    features: [String],
    sales: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
gigSchema.index({ title: "text", category: "text" });
exports.default = (0, mongoose_1.model)("Gig", gigSchema);
