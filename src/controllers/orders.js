import Order from "../models/order.js";

import { httpsCodes } from "../constants.js";

const { OK, FORBIDDEN } = httpsCodes;

/**
 * @desc Confirm an order
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/orders/single
 * @access private
 */
export const confirmOrder = async (req, res, next) => {
  try {
    const paymentIntent = req.body?.paymentIntent;

    if (!paymentIntent) {
      res.status(FORBIDDEN);
      throw Error("Payment intent is required!");
    }

    const order = await Order.findOne({
      payment_intent: paymentIntent,
    }).lean();

    if (!order) {
      res.status(FORBIDDEN);
      throw Error("Payment intent not valid!");
    }

    await Order.findOneAndUpdate(
      {
        payment_intent: paymentIntent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    return res.status(OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all orders
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/orders
 * @access private
 */
export const getOrders = async (req, res, next) => {
  try {
    const completedOrders = await Order.find({
      ...(req.user.isSeller
        ? { sellerId: req.user.id }
        : { buyerId: req.user.id }),
      isCompleted: true,
    })
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

    return res.status(OK).json(completedOrders);
  } catch (error) {
    next(error);
  }
};
