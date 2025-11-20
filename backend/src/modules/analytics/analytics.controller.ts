// src/modules/analytics/analytics.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const start = req.query.start as string | undefined;
    const end = req.query.end as string | undefined;

    const where: any = { userId };
    if (start || end) {
      where.date = {};
      if (start) where.date.gte = new Date(start);
      if (end) where.date.lte = new Date(end);
    }

    const expenses = await prisma.expense.findMany({ where });

    const totalIncome = expenses.filter(e => e.type === "INCOME").reduce((s, e) => s + e.amount, 0);
    const totalExpense = expenses.filter(e => e.type === "EXPENSE").reduce((s, e) => s + e.amount, 0);

    // category totals
    const byCategory: Record<string, number> = {};
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    }

    res.json({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      categories: byCategory
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
