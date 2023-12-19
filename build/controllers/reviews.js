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
exports.deleteReview = exports.createReview = exports.getReviews = void 0;
const gig_js_1 = __importDefault(require("../models/gig.js"));
const review_js_1 = __importDefault(require("../models/review.js"));
const order_js_1 = __importDefault(require("../models/order.js"));
const http_js_1 = require("../constants/http.js");
const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get all reviews
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/:gigId
 * @access public
 */
const getReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId } = req.params;
        const reviews = yield review_js_1.default.find({ gigId }).populate("userId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ]);
        return res.status(OK).json({ success: true, reviews });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviews = getReviews;
/**
 * @desc Create a review
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/single
 * @access private
 */
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, isSeller } = req.user;
        const { gigId, description, starNumber } = req.body;
        if (isSeller) {
            res.status(FORBIDDEN);
            throw Error("Sellers cannot create a review");
        }
        const review = yield review_js_1.default.findOne({ userId, gigId }).lean();
        if (review) {
            res.status(FORBIDDEN);
            throw Error("Reivew already created");
        }
        const order = yield order_js_1.default.findOne({
            buyerId: userId,
            gigId,
            isCompleted: true,
        });
        if (!order) {
            res.status(UNAUTHORIZED);
            throw Error("User has not purchased the gig");
        }
        const newReview = yield review_js_1.default.create({
            userId,
            gigId,
            description,
            starNumber,
        });
        if (!newReview) {
            res.status(UNAUTHORIZED);
            throw Error("Error creating a review");
        }
        const gig = yield gig_js_1.default.findOneAndUpdate({ _id: gigId }, {
            $inc: { totalStars: 1, starNumber },
        }, {
            new: true,
        });
        if (!gig) {
            res.status(UNAUTHORIZED);
            throw Error("Error updating gig totalStars and starNumber");
        }
        return res.status(CREATED).json({ success: true, review: newReview });
    }
    catch (error) {
        next(error);
    }
});
exports.createReview = createReview;
/**
 * @desc Delete a review
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/reviews/single/:gigId
 * @access private
 */
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: loggedInUserId } = req.user;
        const { gigId } = req.params;
        const review = yield review_js_1.default.findOne({
            gigId,
            userId: loggedInUserId,
        }).lean();
        if (!review) {
            res.status(NOT_FOUND);
            throw Error("Review not found");
        }
        if (review.userId.toString() !== loggedInUserId) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        const deletedReview = yield review_js_1.default.findOneAndDelete({
            gigId,
            userId: loggedInUserId,
        });
        if (!deletedReview) {
            res.status(UNAUTHORIZED);
            throw Error("Error deleting a review");
        }
        res.status(OK).json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
