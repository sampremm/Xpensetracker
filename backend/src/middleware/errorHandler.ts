// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  console.log(err);
  res.status(status).json({ error: err.message });
};
