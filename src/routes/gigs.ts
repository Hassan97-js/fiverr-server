import express from "express";

import {
  getGigs,
  getPrivateGigs,
  getGig,
  createGig,
  deleteGig
} from "../controllers/gigs";

import { verifyToken } from "../middlewares/verify";
import { validate } from "../middlewares/validate";

import {
  createGigValidation,
  getPublicGigsValidation,
  checkObjectIdValidator
} from "../constants/validator";

const router = express.Router();

router.get("/private", verifyToken, getPrivateGigs);
router.get("/", validate(getPublicGigsValidation), getGigs);
router.get("/single/:id", validate(checkObjectIdValidator), getGig);
router.post("/single", verifyToken, validate(createGigValidation), createGig);
router.delete(
  "/single/:id",
  verifyToken,
  validate(checkObjectIdValidator),
  deleteGig
);

export default router;
