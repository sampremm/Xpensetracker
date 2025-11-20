// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 6000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh";
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
export const REFRESH_TOKEN_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7);
