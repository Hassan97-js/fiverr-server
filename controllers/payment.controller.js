import Stripe from "stripe";

import { Order } from "../models/index.js";

import { Gig } from "../models/index.js";

// import { calculateOrderAmount } from "../utils/index.js";

import constants from "../constants.js";

const { FORBIDDEN, NOT_FOUND, OK } = constants.httpCodes;

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
    const { id: userId, isSeller } = req.userAuth;

    if (isSeller) {
      res.status(FORBIDDEN);
      throw Error("Sellers are not allowed to make orders!");
    }

    const gigId = req.body?.gigId;

    if (!gigId) {
      res.status(FORBIDDEN);
      throw Error("gigId is required!");
    }

    const gig = await Gig.findById(gigId).lean();

    if (!gig) {
      res.status(NOT_FOUND);
      throw Error("Gig not found!");
    }

    if (gig.userId === userId) {
      res.status(FORBIDDEN);
      throw Error("Only clients are allowed to order a gig!");
    }

    const stripe = new Stripe(process.env.STRIPE_TEST_SECRECT_KEY);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "sek",
      automatic_payment_methods: {
        enabled: true
        // allow_redirects: "never"
      }
      // confirm: true
    });

    await Order.create({
      gigId,
      imgURL: gig.gigCoverImg,
      title: gig.title,
      buyerId: req.userAuth.id,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id
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
