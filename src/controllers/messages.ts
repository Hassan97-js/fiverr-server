import { type Request, type Response, type NextFunction } from "express";
import Conversation from "../models/conversation";
import Message from "../models/message";

import { httpsCodes } from "../constants/http";

const { OK, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/messages/:id
 * @access private
 */
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const conversationId = req.params.id;

    if (!conversationId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const messages = await Message.find({
      conversationId
    })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res.status(OK).json({ success: true, chatMessages: messages });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};

/**
 * @route /api/messages/single
 * @access private
 */
export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { conversationId, text } = req.body;

    const newMessage = await Message.create({
      conversationId,
      userId,
      text
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
          lastMessage: text
        }
      },
      { new: true }
    );

    if (!conversation) {
      res.status(UNAUTHORIZED);
      throw Error("Error updating a conversation");
    }

    return res.status(CREATED).json({ success: true, chatMessage: newMessage });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};
