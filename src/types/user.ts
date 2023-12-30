import { type JwtPayload as TJwtPayload } from "jsonwebtoken";

export type TUser = {
  id: string;
  username: string;
  email: string;
  isSeller: boolean;
};

export type TJwtUser = TUser & TJwtPayload;
