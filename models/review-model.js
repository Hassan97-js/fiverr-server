import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    starNumber: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5]
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("Review", reviewSchema);
