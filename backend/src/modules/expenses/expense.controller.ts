// src/modules/expenses/expense.controller.ts
import { Request, Response } from "express";
import * as service from "./expense.service";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1).optional(),
  note: z.string().optional().nullable(),
  date: z.string().optional()
});

export const createExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const data = createSchema.parse(req.body);
    const expense = await service.createExpense({
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      note: data.note ?? null,
      date: data.date ? new Date(data.date) : undefined,
      userId
    });
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const filters = {
      start: req.query.start as string | undefined,
      end: req.query.end as string | undefined,
      category: req.query.category as string | undefined,
      type: req.query.type as string | undefined
    };
    const items = await service.getExpenses(userId, filters);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    await service.deleteExpense(id, userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    const expense = await service.getExpenseById(id, userId);
    res.json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
// export const updateExpense = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId!;
//     const id = Number(req.params.id);
//     const data = req.body;
//     const updated = await service.updateExpense(id, userId, data);
//     res.json(updated);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// }