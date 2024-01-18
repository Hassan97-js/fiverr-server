import { type Request, type Response, type NextFunction } from "express";

import User from "../models/user";
import Chat from "../models/chat";

import { httpsCodes } from "../constants/http";

const { OK, NOT_FOUND, FORBIDDEN, CREATED, UNAUTHORIZED } = httpsCodes;

/**
 * @route /api/chats
 * @access private
 */
export const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isSeller, id: userId } = req.user;

    const chats = await Chat.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
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
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
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
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
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
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};

/**
 * @route /api/chats/single
 * @access private
 */
export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isSeller, id: senderId } = req.user;
    const receiverId = req.body.receiverId;

    if (receiverId === senderId) {
      res.status(FORBIDDEN);
      throw Error("Forbidden");
    }

    const user = await User.findById(receiverId).lean();

    if (!user) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthrized");
    }

    if (isSeller && user.isSeller) {
      res.status(FORBIDDEN);
      throw Error("Seller is not allowed to create a chat with another seller");
    }

    if (!isSeller && !user.isSeller) {
      res.status(FORBIDDEN);
      throw Error("Client is not allowed to create a chat with another client");
    }

    const chatId = isSeller ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;

    const chat = await Chat.findOne({
      chatId
    });

    if (chat) {
      return res.status(CREATED).json({ succcess: true, chat });
    }

    const newChat = await Chat.create({
      chatId,
      sellerId: isSeller ? senderId : receiverId,
      buyerId: isSeller ? receiverId : senderId,
      readBySeller: !!isSeller,
      readByBuyer: !isSeller
    });

    return res.status(CREATED).json({ succcess: true, chat: newChat });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }

    if (typeof error === "string") {
      next(error);
    }
  }
};
