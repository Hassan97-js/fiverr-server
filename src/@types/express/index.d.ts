import { TUser } from "../../types/user";

// declare namespace Express {
//   export interface Request {
//     user?: TUser;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: TUser;
    }
  }
}
