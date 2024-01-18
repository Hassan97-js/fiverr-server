import { Schema, model } from "mongoose";

const gigSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
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
      default: 0,
      min: 0,
      max: 5
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      min: 1,
      max: 10000,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: true
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
    features: [String],
    sales: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

gigSchema.index({ title: "text", category: "text" });

export default model("Gig", gigSchema);
