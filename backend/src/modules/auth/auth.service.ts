// src/modules/auth/auth.service.ts
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateAccessToken, generateRefreshToken, revokeRefreshToken } from "../../utils/jwt";

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
};

export const loginUserService  = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Invalid credentials");
  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
};
export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};