import {APIUser} from "../models/user";

declare global {
  namespace Express {
    interface Request {
      jwt_user?: APIUser;
    }
  }
}
