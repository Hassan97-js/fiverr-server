import { TUser } from "../../types/user";

declare global {
  namespace Express {
    interface Request {
      user: TUser;
    }
  }
}
