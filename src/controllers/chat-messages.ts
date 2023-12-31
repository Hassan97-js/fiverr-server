import { type Request, type Response, type NextFunction } from "express";
import Chat from "../models/chat";
import ChatMessage from "../models/chat-message";

import { httpsCodes } from "../constants/http";

const { OK, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/chat-messages/:id
 * @access private
 */
export const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const chatId = req.params.id;

    if (!chatId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const messages = await ChatMessage.find({ chatId })
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
 * @route /api/chat-messages/single
 * @access private
 */
export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, isSeller } = req.user;
    const { chatId, text } = req.body;

    const newMessage = await ChatMessage.create({
      chatId,
      userId,
      text
    });

    if (!newMessage) {
      res.status(UNAUTHORIZED);
      throw Error("Error creating a message");
    }

    const chat = await Chat.findOneAndUpdate(
      { fetchId: chatId },
      {
        $set: {
          readBySeller: isSeller,
          readByBuyer: !isSeller,
          lastMessage: text
        }
      },
      { new: true }
    );

    if (!chat) {
      res.status(UNAUTHORIZED);
      throw Error("Error updating a chat");
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
