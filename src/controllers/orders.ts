import { type Request, type Response, type NextFunction } from "express";

import Order from "../models/order";

import { httpsCodes } from "../constants/http";

const { FORBIDDEN, OK, VALIDATION_ERROR, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/orders
 * @access private
 */
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, isSeller } = req.user;

    const completedOrders = await Order.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
      isCompleted: true
    })
      .populate("gigId", ["coverImage", "title", "price", "userId"])
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId", ["username", "email", "image", "country", "isSeller"])
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
 * @route /api/orders/single
 * @access private
 */
export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntent } = req.body;

    const order = await Order.findOne({
      payment_intent: paymentIntent,
      isCompleted: true
    });

    if (order?.isCompleted) {
      res.status(FORBIDDEN);
      throw Error("Order is already completed");
    }

    await Order.findOneAndUpdate(
      {
        payment_intent: paymentIntent
      },
      {
        $set: {
          isCompleted: true
        }
      }
    );

    return res.status(OK).json({ success: true, message: "Order completed" });
  } catch (error) {
    next(error);
  }
};
