import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      max: 25
    },
    password: {
      type: String,
      required: true,
      max: 25,
      select: false
    },
    email: {
      type: String,
      minLength: 5,
      maxLength: 30,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },
    image: String,
    country: {
      type: String,
      required: [true, "Please add your country"]
    },
    phone: String,
    description: String,
    isSeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    bufferTimeoutMS: 90000
  }
);

export default model("User", userSchema);
