// src/modules/analytics/analytics.routes.ts
import { Router } from "express";
import { getSummary } from "./analytics.controller";
import { verifyToken } from "../../middleware/auth";

const router = Router();
router.use(verifyToken);

router.get("/summary", getSummary);

export default router;
