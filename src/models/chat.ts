import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true
    },
    sellerId: {
      type: String,
      ref: "User",
      required: true
    },
    buyerId: {
      type: String,
      ref: "User",
      required: true
    },
    lastMessage: String,
    readBySeller: {
      type: Boolean,
      required: true
    },
    readByBuyer: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Chat", chatSchema);
