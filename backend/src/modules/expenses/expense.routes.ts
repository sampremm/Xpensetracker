// src/modules/expenses/expense.routes.ts
import { Router } from "express";
import { createExpense, getAllExpenses, deleteExpense, getExpenseById, createFromSMS, createBulkFromSMS } from "./expense.controller";
import { verifyToken } from "../../middleware/auth";

const router = Router();
router.use(verifyToken);

router.get("/", getAllExpenses);
router.post("/", createExpense);
router.post("/sms/single", createFromSMS); // Single SMS transaction
router.post("/sms/bulk", createBulkFromSMS); // Bulk SMS transactions
router.get("/:id", getExpenseById);
router.delete("/:id", deleteExpense);

export default router;
