import Stripe from "stripe";

import Gig from "../models/gig.js";
import Order from "../models/order.js";

import { STRIPE_TEST_SECRECT_KEY } from "../config/index.js";
import { httpsCodes } from "../constants/http.js";

const { FORBIDDEN, NOT_FOUND, OK } = httpsCodes;

/**
 * @desc Create a payment intent
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/payment/create-payment-intent
 * @access private
 */
export const createPaymentIntent = async (req, res, next) => {
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

    const stripe = new Stripe(STRIPE_TEST_SECRECT_KEY);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "sek",
      automatic_payment_methods: {
        enabled: true,
        // allow_redirects: "never"
      },
      // confirm: true
    });

    await Order.create({
      gigId,
      image: gig.coverImage,
      title: gig.title,
      buyerId: req.user.id,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });

    return res.status(OK).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    switch (error.type) {
      case "StripeCardError": {
        console.log(`A payment error occurred: ${e.message}`);
        console.log(error.message);
        next(error);
        break;
      }
      case "StripeInvalidRequestError": {
        console.log("An invalid request occurred.");
        console.log(error.message);
        next(error);
        break;
      }

      default: {
        console.log("Another problem occurred, maybe unrelated to Stripe.");
        console.log(error.message);
        next(error);
      }
    }
  }
};
