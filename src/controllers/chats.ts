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

    const converations = await Chat.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
      fetchId: { $regex: userId }
    })
      .sort({
        updatedAt: -1
      })
      .populate("sellerId", ["username", "email", "image", "country", "isSeller"])
      .populate("buyerId", ["username", "email", "image", "country", "isSeller"])
      .lean();

    return res.status(OK).json({ success: true, converations });
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

    const chat = await Chat.findOne({ fetchId: chatId })
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
export const updateChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const chatId = req.body.id;

    if (!chatId.includes(user.id)) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthorized");
    }

    const updatedChat = await Chat.findOneAndUpdate(
      { fetchId: chatId },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true
        }
      },
      { new: true }
    ).lean();

    if (!updatedChat) {
      res.status(FORBIDDEN);
      throw Error("Error updating chat");
    }

    return res.status(OK).json({
      success: true,
      chat: updatedChat,
      message: "Chat updated"
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
export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isSeller, id: userId } = req.user;
    const messageToId = req.body.messageToId;

    if (messageToId === userId) {
      res.status(FORBIDDEN);
      throw Error("Forbidden");
    }

    const user = await User.findById(messageToId).lean();

    if (!user) {
      res.status(UNAUTHORIZED);
      throw Error("Unauthrized");
    }

    if (isSeller && user.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Seller is not allowed to create a chat with another seller"
      );
    }

    if (!isSeller && !user.isSeller) {
      res.status(FORBIDDEN);
      throw Error(
        "Client is not allowed to create a chat with another client"
      );
    }

    const chat = await Chat.findOne({
      fetchId: isSeller ? userId + messageToId : messageToId + userId
    });

    if (chat) {
      return res.status(CREATED).json({ succcess: true, chat });
    }

    const newChat = await Chat.create({
      fetchId: isSeller ? userId + messageToId : messageToId + userId,
      sellerId: isSeller ? userId : messageToId,
      buyerId: isSeller ? messageToId : userId,
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
