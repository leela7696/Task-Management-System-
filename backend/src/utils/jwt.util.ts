import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export class JwtUtil {
  public static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_SECRET as jwt.Secret, { expiresIn: ACCESS_EXPIRATION as any });
  }

  public static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_SECRET as jwt.Secret, { expiresIn: REFRESH_EXPIRATION as any });
  }

  public static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_SECRET as jwt.Secret) as TokenPayload;
  }

  public static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_SECRET as jwt.Secret) as TokenPayload;
  }
}
