import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please add your username"],
      unique: [true, "Username is already taken"]
    },
    password: {
      type: String,
      required: [true, "Please add your password"]
    },
    email: {
      type: String,
      minLength: 10,
      maxLength: 30,
      lowercase: true,
      required: [true, "Please add your email"],
      unique: [true, "Email address is already taken"]
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
    timestamps: true
  }
);

export default model("User", userSchema);
