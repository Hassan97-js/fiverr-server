"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gigs_js_1 = require("../controllers/gigs.js");
const verify_js_1 = require("../middlewares/verify.js");
const validate_js_1 = require("../middlewares/validate.js");
const validator_js_1 = require("../constants/validator.js");
const router = express_1.default.Router();
router.get("/", (0, validate_js_1.validate)(validator_js_1.getPublicGigsValidation), gigs_js_1.getGigs);
router.get("/private", verify_js_1.verifyToken, gigs_js_1.getPrivateGigs);
router.get("/single/:id", (0, validate_js_1.validate)(validator_js_1.checkObjectIdValidator), gigs_js_1.getGig);
router.post("/single", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.createGigValidation), gigs_js_1.createGig);
router.delete("/single/:id", verify_js_1.verifyToken, (0, validate_js_1.validate)(validator_js_1.checkObjectIdValidator), gigs_js_1.deleteGig);
exports.default = router;
