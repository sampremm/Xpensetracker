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

// Schema for SMS parsed data
const smsSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  title: z.string().min(1),
  category: z.string(),
  confidence: z.number().min(0).max(1),
  bank: z.string().optional(),
  smsBodies: z.array(z.string()).optional(), // Store original SMS bodies
  date: z.string().optional()
});

const bulkSmsSchema = z.array(smsSchema);

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

// Create expense from single SMS
export const createFromSMS = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const data = smsSchema.parse(req.body);
    
    const expense = await service.createExpense({
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      note: data.smsBodies ? data.smsBodies[0] : null,
      date: data.date ? new Date(data.date) : undefined,
      userId
    });
    
    res.status(201).json({
      success: true,
      expense,
      confidence: data.confidence,
      bank: data.bank
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Create expenses from bulk SMS
export const createBulkFromSMS = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const transactions = bulkSmsSchema.parse(req.body);
    
    const expenses = await service.createBulkExpenses(
      transactions.map(t => ({
        title: t.title,
        amount: t.amount,
        type: t.type,
        category: t.category,
        note: t.smsBodies ? t.smsBodies[0] : null,
        date: t.date ? new Date(t.date) : undefined,
        userId
      }))
    );
    
    res.status(201).json({
      success: true,
      count: expenses.length,
      expenses
    });
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
// }