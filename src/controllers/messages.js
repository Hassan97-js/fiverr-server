import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

import { httpsCodes } from "../constants/http.js";

const { OK, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @desc Get all messages
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/messages/:id
 * @access private
 */
export const getMessages = async (req, res, next) => {
  try {
    const user = req.user;
    const conversationId = req.params.id;

    // TODO: Implement authorization logic to restrict it to only messages owners
    if (!conversationId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const messages = await Message.find({
      conversationId,
    })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res
      .status(OK)
      .json({ success: true, chatMessages: messages, message: null });
  } catch (error) {
    next(error);
  }
};

/* TODO: Continue with creating a message then get messages */

/**
 * @desc Create a single message
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @route /api/messages/single
 * @access private
 */
export const createMessage = async (req, res, next) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { conversationId, text } = req.body;

    const newMessage = await Message.create({
      conversationId,
      userId,
      text,
    });

    if (!newMessage) {
      res.status(UNAUTHORIZED);
      throw Error("Error creating a message");
    }

    const conversation = await Conversation.findOneAndUpdate(
      { fetchId: conversationId },
      {
        $set: {
          readBySeller: isSeller,
          readByBuyer: !isSeller,
          lastMessage: text,
        },
      },
      { new: true }
    );

    if (!conversation) {
      res.status(UNAUTHORIZED);
      throw Error("Error updating a conversation");
    }

    return res
      .status(CREATED)
      .json({ success: true, chatMessage: newMessage, message: null });
  } catch (error) {
    next(error);
  }
};
