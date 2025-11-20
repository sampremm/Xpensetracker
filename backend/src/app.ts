// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(cors({
  origin: true, // reflect the request origin
  credentials: true, // allow cookies across domains
}));

app.get("/", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
