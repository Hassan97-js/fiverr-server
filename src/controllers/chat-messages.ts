import { type Request, type Response, type NextFunction } from "express";
import { decode } from "html-entities";

import Chat from "../models/chat";
import User from "../models/user";
import ChatMessage from "../models/chat-message";

import { httpsCodes } from "../constants/http";

const { OK, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/chat-messages/:id
 * @access private
 */
export const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const chatId = req.params.id;

    if (!chatId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const ids = chatId?.split("-");
    const chatId1 = ids?.[0];
    const chatId2 = ids?.[1];

    const receiverId = chatId1 === user.id ? chatId2 : chatId1;

    const receiver = await User.findById(receiverId).lean();

    if (!receiver) {
      res.status(UNAUTHORIZED);
      throw Error("Invalid chat id");
    }

    const receiverToSend = {
      _id: receiver._id,
      username: receiver.username,
      email: receiver.email,
      country: receiver.country,
      isSeller: receiver.isSeller,
      image: decode(receiver.image)
    };

    const messages = await ChatMessage.find({ chatId })
      .populate("userId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res.status(OK).json({ success: true, chatMessages: messages, receiver: receiverToSend });
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/chat-messages/single
 * @access private
 */
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
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
      { chatId },
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
    next(error);
  }
};
