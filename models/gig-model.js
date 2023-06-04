import { Schema, model } from "mongoose";

const gigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    totalStars: {
      type: Number,
      default: 0
    },
    starNumber: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    gigCoverImg: {
      type: String,
      required: true
    },
    gigImgs: {
      type: [String],
      required: false
    },
    shortTitle: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String,
      required: true
    },
    deliveryTime: {
      type: Number,
      required: true
    },
    revisionNumber: {
      type: Number,
      required: true
    },
    features: {
      type: [String],
      required: false
    },
    sales: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default model("Gig", gigSchema);
