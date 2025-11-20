// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { signup, login, refresh, logout, me } from "./auth.controller";
import { verifyToken } from "../../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", verifyToken, me);
export default router;
