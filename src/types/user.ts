import { type JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export type TUser = {
  id: Types.ObjectId;
  username: string;
  email: string;
  isSeller: string;
};

export type TJwtUser = TUser & JwtPayload;
