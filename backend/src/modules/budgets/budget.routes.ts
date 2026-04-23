import { Router } from "express";
import { setBudget, getBudgets, deleteBudget } from "./budget.controller";
import { verifyToken } from "../../middleware/auth";

const router = Router();
router.use(verifyToken);

router.post("/", setBudget);
router.get("/", getBudgets);
router.delete("/:id", deleteBudget);

export default router;
