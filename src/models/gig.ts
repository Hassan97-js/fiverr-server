import { Schema, model } from "mongoose";

const gigSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true
    },
    ratingsSum: {
      type: Number,
      default: 0
    },
    numberOfRatings: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
    timestamps: true,
    bufferTimeoutMS: 90000
  }
);

gigSchema.index({ title: "text", category: "text" });

export default model("Gig", gigSchema);
