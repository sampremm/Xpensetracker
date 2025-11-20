import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 🍪 Try from cookie first
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  req.userId = payload.userId;
  next();
};
