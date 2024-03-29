import { type Request, type Response, type NextFunction } from "express";
import Stripe from "stripe";

import Gig from "../models/gig";
import Order from "../models/order";

import { STRIPE_TEST_SECRECT_KEY } from "../config/index";

import { httpsCodes } from "../constants/http";
import { logger } from "../constants/logger";

const { FORBIDDEN, NOT_FOUND, OK } = httpsCodes;

/**
 * @route /api/payment/create-payment-intent
 * @access private
 */
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { gigId } = req.body;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers are not allowed to make orders");
    }

    const gig = await Gig.findById(gigId).lean();

    if (!gig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found");
    }

    if (gig.userId === userId) {
      res.status(FORBIDDEN);
      throw Error("You are the owner of the gig");
    }

    const stripe = new Stripe(STRIPE_TEST_SECRECT_KEY!, {
      apiVersion: "2023-08-16",
      typescript: true
    });

    // confirm: true
    // allow_redirects: "never"
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "sek",
      automatic_payment_methods: {
        enabled: true
      }
    });

    await Order.create({
      gigId,
      image: gig.coverImage,
      title: gig.title,
      buyerId: req.user.id,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id
    });

    return res.status(OK).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
