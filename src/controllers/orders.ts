import { type Request, type Response, type NextFunction } from "express";

import Order from "../models/order";

import { httpsCodes } from "../constants/http";

const { FORBIDDEN, OK, VALIDATION_ERROR, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/orders
 * @access private
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};

/**
 * @route /api/orders/single
 * @access private
 */
export const confirmOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};