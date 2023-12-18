import Order from "../models/order.js";

import { httpsCodes } from "../constants/http.js";

const { FORBIDDEN, OK, VALIDATION_ERROR, UNAUTHORIZED } = httpsCodes;

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
    const { id: userId, isSeller } = req.user;

    const completedOrders = await Order.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
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

    if (!completedOrders) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    return res.status(OK).json({ success: true, orders: completedOrders });
  } catch (error) {
    next(error);
  }
};

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
    const { paymentIntent } = req.body;

    const order = await Order.findOne({
      payment_intent: paymentIntent,
      isCompleted: true,
    }).lean();

    if (order) {
      res.status(FORBIDDEN);
      throw Error("Order is already completed");
    }

    if (!order) {
      res.status(VALIDATION_ERROR);
      throw Error("Payment intent is not valid");
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

    return res.status(OK).json({ success: true, message: "Order completed" });
  } catch (error) {
    next(error);
  }
};
