import User from "../models/user.js";
import Conversation from "../models/conversation.js";

import { httpsCodes } from "../constants/http.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get all conversations
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/conversations
 * @access private
 */
export const getConversations = async (req, res, next) => {
  try {
    const { isSeller, id: userId } = req.user;

    // if (!conversation.fetchId.includes(user.id)) {
    //   res.status(UNAUTHORIZED);
    //   throw Error("Unauthorized");
    // }

    // TODO: Implement authorization logic to restrict it to only messages owners
    const converations = await Conversation.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
      // fetchId: { $regex: `/${userId}/`, $options: "i" },
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

    converations.filter((c) => {
      if (c.fetchId.includes(userId)) {
        return c;
      }
    });

    return res.status(OK).json({ success: true, converations, message: null });
  } catch (error) {
    next(error);
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

    // TODO: Implement authorization logic to restrict it to only messages owners
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

    if (!conversation.fetchId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    return res.status(OK).json({
      succcess: true,
      conversation,
      message: null,
    });
  } catch (error) {
    next(error);
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
    const conversationId = req.body?.id;

    // TODO: Implement authorization logic to restrict it to only messages owners
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
    next(error);
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
      return res
        .status(CREATED)
        .json({ succcess: true, conversation, message: null });
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
      .json({ succcess: true, conversation: newConversation, message: null });
  } catch (error) {
    next(error);
  }
};