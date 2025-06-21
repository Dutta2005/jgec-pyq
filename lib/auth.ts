import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export interface JwtPayload {
  email: string;
  role: 'admin';
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.email === 'string' &&
      (payload.role === 'admin')
    ) {
      return { email: payload.email, role: payload.role };
    }
    return null;
  } catch (error) {
    console.log('Error verifying token:', error);
    return null;
  }
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}