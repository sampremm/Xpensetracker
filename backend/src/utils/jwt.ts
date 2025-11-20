import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES_DAYS } from "../config/env";
import { prisma } from "../prisma/client";




export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    return payload;
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null; // 👈 prevent undefined access
  }
};

export const generateRefreshToken = async (userId: number): Promise<string> => {
  const token = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRES_DAYS}d` });

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};
