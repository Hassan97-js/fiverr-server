import { type Request, type Response, type NextFunction } from "express";

import User from "../models/user";
import Chat from "../models/chat";

import { httpsCodes } from "../constants/http";
import { logger } from "../constants/logger";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/chats
 * @access private
 */
export const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isSeller, id: userId } = req.user;

    const chats = await Chat.find({
      chatId: { $regex: userId }
    })
      .sort({
        updatedAt: -1
      })
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res.status(OK).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/chats/single/:id
 * @access private
 */
export const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { id: chatId } = req.params;

    if (!chatId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const chat = await Chat.findOne({ chatId })
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    if (!chat) {
      res.status(NOT_FOUND);
      throw Error("Chat not found");
    }

    return res.status(OK).json({
      succcess: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/chats/single
 * @access private
 */
export const updateChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const chatId = req.body.id;

    if (!chatId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const updatedChat = await Chat.findOneAndUpdate(
      { chatId },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true
        }
      },
      { new: true }
    ).lean();

    return res.status(OK).json({
      success: true,
      chat: updatedChat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/chats/single
 * @access private
 */
export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isSeller, id: userId } = req.user;
    const { receiverId } = req.body;

    if (receiverId === userId) {
      res.status(FORBIDDEN);
      throw Error("Forbidden");
    }

    const otherUser = await User.findById(receiverId).lean();

    if (!otherUser) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthrized");
    }

    if (isSeller && otherUser.isSeller) {
      res.status(FORBIDDEN);
      throw Error("Seller is not allowed to create a chat with another seller");
    }

    if (!isSeller && !otherUser.isSeller) {
      res.status(FORBIDDEN);
      throw Error("Client is not allowed to create a chat with another client");
    }

    const chatId = `${userId}-${otherUser._id.toString()}`;

    const chat = await Chat.findOne({
      chatId
    });

    if (chat) {
      return res.status(OK).json({ succcess: true, chat });
    }

    const newChat = await Chat.create({
      chatId,
      sellerId: isSeller ? userId : receiverId,
      buyerId: !isSeller ? receiverId : userId,
      readBySeller: !!isSeller,
      readByBuyer: !isSeller
    });

    return res.status(CREATED).json({ succcess: true, chat: newChat });
  } catch (error) {
    next(error);
  }
};
