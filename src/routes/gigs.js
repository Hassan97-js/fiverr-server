import express from "express";

import {
  getGigs,
  getPrivateGigs,
  getGig,
  createGig,
  deleteGig,
} from "../controllers/gigs.js";

import { verifyToken } from "../middlewares/verify.js";
import { validate } from "../middlewares/validate.js";

import {
  createGigValidation,
  getPublicGigsValidation,
  checkObjectIdValidator,
} from "../constants/validator.js";

const router = express.Router();

router.get("/", validate(getPublicGigsValidation), getGigs);
router.get("/private", verifyToken, getPrivateGigs);
router.get("/single/:id", validate(checkObjectIdValidator), getGig);
router.post("/single", verifyToken, validate(createGigValidation), createGig);
router.delete(
  "/single/:id",
  verifyToken,
  validate(checkObjectIdValidator),
  deleteGig
);

export default router;
