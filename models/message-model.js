import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true
    },
    // type mongoose.SchemaTypes.ObjectId
    // ref: "User"
    userId: {
      type: String,
      required: true
    },
    messageText: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Message", messageSchema);
