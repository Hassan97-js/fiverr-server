import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    lastMessage: {
      type: String,
      required: false
    },
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
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

export default model("Conversation", conversationSchema);
