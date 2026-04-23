import { Request, Response } from "express";
import * as service from "./budget.service";
import { z } from "zod";

const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
});

export const setBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const data = budgetSchema.parse(req.body);
    const budget = await service.createOrUpdateBudget(userId, data.category, data.amount, data.month);
    res.json(budget);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const month = req.query.month as string || new Date().toISOString().slice(0, 7);
    const budgets = await service.getBudgets(userId, month);
    res.json(budgets);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });
    await service.deleteBudget(id, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
