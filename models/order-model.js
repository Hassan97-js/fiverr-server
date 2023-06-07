import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true
    },
    imgURL: String,
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      min: 1,
      max: 10000,
      required: true
    },
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    paymentIntent: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Order", orderSchema);
