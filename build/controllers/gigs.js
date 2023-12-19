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
exports.deleteGig = exports.createGig = exports.getGig = exports.getGigs = exports.getPrivateGigs = void 0;
const html_entities_1 = require("html-entities");
const gig_js_1 = __importDefault(require("../models/gig.js"));
const http_js_1 = require("../constants/http.js");
const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = http_js_1.httpsCodes;
/**
 * @desc Get user private gigs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/private
 * @access private
 */
const getPrivateGigs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const gigs = yield gig_js_1.default.find({ userId })
            .populate("userId", ["username", "email", "image", "country", "isSeller"])
            .lean();
        res.status(OK).json({
            gigs,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPrivateGigs = getPrivateGigs;
/**
 * @desc Get all gigs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs
 * @access public
 */
const getGigs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sort: sortBy, search, min, max } = req.query;
        let filterQuery = {};
        if (min || max) {
            min && (filterQuery.price = { $gte: parseInt(min) });
            max && (filterQuery.price = { $lte: parseInt(max) });
        }
        if (min && max) {
            filterQuery.price = { $gte: parseInt(min), $lte: parseInt(max) };
        }
        if (search) {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { $text: {
                    $search: `"${(0, html_entities_1.decode)(search)}"`,
                    $caseSensitive: false,
                    $diacriticSensitive: false,
                } });
        }
        const sortByKey = sortBy || "createdAt";
        const gigs = yield gig_js_1.default.find(filterQuery)
            .populate("userId", ["username", "email", "image", "country", "isSeller"])
            .sort({
            [sortByKey]: -1,
        })
            .lean();
        res.status(OK).json({
            success: true,
            gigs,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getGigs = getGigs;
/**
 * @desc Get a single gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single/:id
 * @access public
 */
const getGig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: gigId } = req.params;
        const gig = yield gig_js_1.default.findById(gigId);
        if (!gig) {
            res.status(NOT_FOUND);
            throw Error("Gig not found");
        }
        const foundGig = yield gig.populate("userId", [
            "username",
            "email",
            "image",
            "country",
            "isSeller",
        ]);
        res.status(OK).json({ success: true, gig: foundGig });
    }
    catch (error) {
        next(error);
    }
});
exports.getGig = getGig;
/**
 *  @desc Create a new gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single
 * @access private
 */
const createGig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title: gigTitle } = req.body;
        const { id: userId, isSeller, username, email } = req.user;
        if (!isSeller) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        const gig = yield gig_js_1.default.findOne({ title: gigTitle }).lean();
        if (gig) {
            res.status(FORBIDDEN);
            throw Error("Gig title already exists");
        }
        const newGig = yield gig_js_1.default.create(Object.assign(Object.assign({}, req.body), { userId }));
        res.status(CREATED).json(newGig);
    }
    catch (error) {
        next(error);
    }
});
exports.createGig = createGig;
/**
 * @desc Delete a gig
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/gigs/single/:id
 * @access private
 */
const deleteGig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: gigId } = req.params;
        const dbGig = yield gig_js_1.default.findById(gigId).lean();
        if (!dbGig) {
            res.status(NOT_FOUND);
            throw Error("Gig not found");
        }
        const { id: loggedInUserId } = req.user;
        if (dbGig.userId.toString() !== loggedInUserId) {
            res.status(UNAUTHORIZED);
            throw Error("Unauthorized");
        }
        yield gig_js_1.default.findByIdAndDelete(gigId);
        res.status(OK).json({ success: true, message: "Gig deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteGig = deleteGig;
