import User from "../models/user";
import Conversation from "../models/conversation";

import { httpsCodes } from "../constants/http";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get all private conversations
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations
 * @access private
 */
export const getConversations = async (req, res, next) => {
  try {
    const { isSeller, id: userId } = req.user;

    const converations = await Conversation.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
      fetchId: { $regex: userId },
    })
      .sort({
        updatedAt: -1,
      })
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

    return res.status(OK).json({ success: true, converations });
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
 * @desc Get a single conversation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single/:id
 * @access private
 */
export const getConversation = async (req, res, next) => {
  try {
    const user = req.user;
    const { id: conversationId } = req.params;

    if (!conversationId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const conversation = await Conversation.findOne({ fetchId: conversationId })
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

    if (!conversation) {
      res.status(NOT_FOUND);
      throw Error("Conversation not found");
    }

    return res.status(OK).json({
      succcess: true,
      conversation,
    });
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
 * @desc Update a single conversation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single
 * @access private
 */
export const updateConversation = async (req, res, next) => {
  try {
    const user = req.user;
    const conversationId = req.body.id;

    if (!conversationId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const updatedConversation = await Conversation.findOneAndUpdate(
      { fetchId: conversationId },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true,
        },
      },
      { new: true }
    ).lean();

    if (!updatedConversation) {
      res.status(FORBIDDEN);
      throw Error("Error updating conversation");
    }

    return res.status(OK).json({
      success: true,
      conversation: updatedConversation,
      message: "Conversation updated",
    });
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
 * @desc Create a single converation
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations/single
 * @access private
 */
export const createConversation = async (req, res, next) => {
  try {
    const { isSeller, id: userId } = req.user;
    const messageToId = req.body.messageToId;

    if (messageToId === userId) {
      res.status(FORBIDDEN);
      throw Error("Forbidden");
    }

    const user = await User.findById(messageToId).lean();

    if (isSeller && user.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Seller is not allowed to create a conversation with another seller"
      );
    }

    if (!isSeller && !user.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Client is not allowed to create a conversation with another client"
      );
    }

    const conversation = await Conversation.findOne({
      fetchId: isSeller ? userId + messageToId : messageToId + userId,
    });

    if (conversation) {
      return res.status(CREATED).json({ succcess: true, conversation });
    }

    const newConversation = await Conversation.create({
      fetchId: isSeller ? userId + messageToId : messageToId + userId,
      sellerId: isSeller ? userId : messageToId,
      buyerId: isSeller ? messageToId : userId,
      readBySeller: !!isSeller,
      readByBuyer: !isSeller,
    });

    return res
      .status(CREATED)
      .json({ succcess: true, conversation: newConversation });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (error instanceof String) {
      next(error);
    }
  }
};
