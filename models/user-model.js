import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    imgURL: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    isSeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default model("User", userSchema);
