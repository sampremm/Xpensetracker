// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import * as service from "./auth.service";
import { z } from "zod";
import { prisma } from "../../prisma/client";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signup = async (req: Request, res: Response) => {
  try {        
    const data = signupSchema.parse(req.body);
    const result = await service.registerUser(data.name, data.email, data.password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await service.loginUserService(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user, message: "Login successful" });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};


export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });
    // verify and rotate
    // Simple approach: verify token and issue new access token
    const decoded = (await import("jsonwebtoken")).verify(token, process.env.REFRESH_SECRET || "refresh") as any;
    const userId = Number(decoded.userId);
    // Verify token exists in DB
    const rt = await prisma.refreshToken.findUnique({ where: { token } });
    if (!rt) return res.status(403).json({ error: "Invalid refresh token" });

    const accessToken = (await import("../../utils/jwt")).generateAccessToken(userId);
    res.json({ accessToken });
  } catch (err: any) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });
    await service.logoutUser(token, res);
    return;
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, currency: true } });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
