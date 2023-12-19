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
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const gig_js_1 = __importDefault(require("../models/gig.js"));
const order_js_1 = __importDefault(require("../models/order.js"));
const index_js_1 = require("../config/index.js");
const http_js_1 = require("../constants/http.js");
const logger_js_1 = require("../constants/logger.js");
const { FORBIDDEN, NOT_FOUND, OK } = http_js_1.httpsCodes;
/**
 * @desc Create a payment intent
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/payment/create-payment-intent
 * @access private
 */
const createPaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, isSeller } = req.user;
        const { gigId } = req.body;
        if (isSeller) {
            res.status(FORBIDDEN);
            throw Error("Sellers are not allowed to make orders");
        }
        const gig = yield gig_js_1.default.findById(gigId).lean();
        if (!gig) {
            res.status(NOT_FOUND);
            throw Error("Gig not found");
        }
        if (gig.userId === userId) {
            res.status(FORBIDDEN);
            throw Error("You are the owner of the gig");
        }
        const stripe = new stripe_1.default(index_js_1.STRIPE_TEST_SECRECT_KEY);
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: gig.price * 100,
            currency: "sek",
            automatic_payment_methods: {
                enabled: true,
                // allow_redirects: "never"
            },
            // confirm: true
        });
        yield order_js_1.default.create({
            gigId,
            image: gig.coverImage,
            title: gig.title,
            buyerId: req.user.id,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: paymentIntent.id,
        });
        return res.status(OK).json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        switch (error.type) {
            case "StripeCardError": {
                logger_js_1.logger.error(`A payment error occurred: ${error.message}`);
                next(error);
                break;
            }
            case "StripeInvalidRequestError": {
                logger_js_1.logger.error(`An invalid request occurred: ${error.message}`);
                next(error);
                break;
            }
            default: {
                logger_js_1.logger.error(`Another problem occurred, maybe unrelated to Stripe: ${error.message}`);
                next(error);
            }
        }
    }
});
exports.createPaymentIntent = createPaymentIntent;
