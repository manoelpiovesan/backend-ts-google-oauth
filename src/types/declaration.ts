export interface JWTUser {
  id: number;
  google_profile_id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      jwt_user?: JWTUser;
    }
  }
}
