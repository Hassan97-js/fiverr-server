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
exports.confirmOrder = exports.getOrders = void 0;
const order_js_1 = __importDefault(require("../models/order.js"));
const http_js_1 = require("../constants/http.js");
const { FORBIDDEN, OK, VALIDATION_ERROR, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get all orders
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/orders
 * @access private
 */
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, isSeller } = req.user;
        const completedOrders = yield order_js_1.default.find(Object.assign(Object.assign({}, (isSeller ? { sellerId: userId } : { buyerId: userId })), { isCompleted: true }))
            .populate("gigId", ["coverImage", "title", "price"])
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
        if (!completedOrders) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        return res.status(OK).json({ success: true, orders: completedOrders });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
/**
 * @desc Confirm an order
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/orders/single
 * @access private
 */
const confirmOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentIntent } = req.body;
        const order = yield order_js_1.default.findOne({
            payment_intent: paymentIntent,
            isCompleted: true,
        }).lean();
        if (order) {
            res.status(FORBIDDEN);
            throw Error("Order is already completed");
        }
        if (!order) {
            res.status(VALIDATION_ERROR);
            throw Error("Payment intent is not valid");
        }
        yield order_js_1.default.findOneAndUpdate({
            payment_intent: paymentIntent,
        }, {
            $set: {
                isCompleted: true,
            },
        });
        return res.status(OK).json({ success: true, message: "Order completed" });
    }
    catch (error) {
        next(error);
    }
});
exports.confirmOrder = confirmOrder;
