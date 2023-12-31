import { Schema, model } from "mongoose";

const chatMessageSchema = new Schema(
  {
    chatId: {
      type: String,
      ref: "Chat",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Message", chatMessageSchema);
