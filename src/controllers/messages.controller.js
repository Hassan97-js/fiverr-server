import { Conversation, Message } from "../models/index.js";
import constants from "../constants.js";

const { OK, FORBIDDEN, CREATED } = constants.httpCodes;

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

    const conversationId = req.body?.conversationId;
    const text = req.body?.text;

    if (!conversationId) {
      res.status(FORBIDDEN);
      throw Error("Converation id is required!");
    }

    if (!text) {
      res.status(FORBIDDEN);
      throw Error("Text is required!");
    }

    const newMessage = await Message.create({
      conversationId,
      userId,
      text
    });

    await Conversation.findOneAndUpdate(
      { fetchId: conversationId },
      {
        $set: {
          readBySeller: isSeller,
          readByBuyer: !isSeller,
          lastMessage: text
        }
      },
      { new: true }
    ).lean();

    return res.status(CREATED).json(newMessage);
  } catch (error) {
    next(error);
  }
};

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
    const conversationId = req.params?.id;

    if (!conversationId) {
      res.status(FORBIDDEN);
      throw Error("Converation id is required!");
    }

    const messages = await Message.find({
      conversationId
    })
      .populate("userId", ["username", "image"])
      .lean();

    return res.status(OK).json(messages);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
