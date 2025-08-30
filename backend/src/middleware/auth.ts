import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // read JWT from cookie

  if (!token) return res.status(401).json({ message: "No token provided" });

  const jwtSecret = process.env.screateKey;
  if (!jwtSecret) return res.status(500).json({ message: "JWT secret key not configured" });

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };
    (req as any).user = decoded; // attach user info to request
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
