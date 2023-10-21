import { Conversation, User } from "../models/index.js";

import constants from "../constants.js";

const { OK, NOT_FOUND, FORBIDDEN, CREATED } = constants.httpCodes;

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
    const messageToId = req.body?.messageToId;

    if (!messageToId) {
      res.status(FORBIDDEN);
      throw Error("messageToId is required!");
    }

    if (messageToId === userId) {
      res.status(FORBIDDEN);
      throw Error("Forbidden!");
    }

    const dbUser = await User.findById(messageToId).lean();

    if (isSeller && dbUser.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Seller is not allowed to create a conversation with another seller!"
      );
    }

    if (!isSeller && !dbUser.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Buyer is not allowed to create a conversation with another buyer!"
      );
    }

    const dbConversation = await Conversation.findOne({
      fetchId: isSeller ? userId + messageToId : messageToId + userId
    });

    if (dbConversation) {
      return res.status(CREATED).json(dbConversation);
    }

    const newConversation = await Conversation.create({
      fetchId: isSeller ? userId + messageToId : messageToId + userId,
      sellerId: isSeller ? userId : messageToId,
      buyerId: isSeller ? messageToId : userId,
      readBySeller: !!isSeller,
      readByBuyer: !isSeller
    });

    return res.status(CREATED).json(newConversation);
  } catch (error) {
    next(error);
  }
};

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

    const converations = await Conversation.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId })
    })
      .sort({
        updatedAt: -1
      })
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res.status(OK).json(converations);
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
    const conversationId = req.params?.id;

    if (!conversationId) {
      res.status(FORBIDDEN);
      throw Error("Conversation id is required!");
    }

    const conversation = await Conversation.findOne({ fetchId: conversationId })
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId",  ["username", "email", "image", "country", "isSeller"])
      .lean();

    if (!conversation) {
      res.status(NOT_FOUND);
      throw Error("Conversation not found!");
    }

    return res.status(OK).json(conversation);
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

    if (!conversationId) {
      res.status(FORBIDDEN);
      throw Error("Conversation ID is required!");
    }

    const updatedConversation = await Conversation.findOneAndUpdate(
      { fetchId: conversationId },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true
        }
      },
      { new: true }
    ).lean();

    if (!updatedConversation) {
      res.status(FORBIDDEN);
      throw Error("Error updating conversation!");
    }

    return res.status(OK).json(updatedConversation);
  } catch (error) {
    next(error);
  }
};
