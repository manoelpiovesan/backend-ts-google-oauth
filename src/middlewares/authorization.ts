import express from "express";
import jwt from "jsonwebtoken";
import {JWTUser} from "../types/declaration";

/**
 * Authentication middleware for Express applications.
 */
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {

  if (securityName !== 'google-jwt') {
    return Promise.reject({ message: 'Unsupported security scheme' });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Promise.reject({ message: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify token and attach user info to request
    request.jwt_user = jwt.verify(token, process.env.JWT_SECRET!) as JWTUser;

    // Role checking
    if (scopes && scopes.length > 0) {
      const userRole = request.jwt_user!.role || 'user';
      if (!scopes.includes(userRole)) {
        return Promise.reject({ message: 'Insufficient role' });
      }
    }

    return Promise.resolve();
  } catch {
    return Promise.reject({ message: 'Invalid token' });
  }

}