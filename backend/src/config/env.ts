// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(6000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  REFRESH_SECRET: z.string().min(10),
  ACCESS_TOKEN_EXPIRES: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_DAYS: z.string().transform(Number).default(7),
});

const _env = envSchema.parse(process.env);

export const PORT = _env.PORT;
export const DATABASE_URL = _env.DATABASE_URL;
export const JWT_SECRET = _env.JWT_SECRET;
export const REFRESH_SECRET = _env.REFRESH_SECRET;
export const ACCESS_TOKEN_EXPIRES = _env.ACCESS_TOKEN_EXPIRES;
export const REFRESH_TOKEN_EXPIRES_DAYS = _env.REFRESH_TOKEN_EXPIRES_DAYS;
