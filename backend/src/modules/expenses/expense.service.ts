// src/modules/expenses/expense.service.ts
import { prisma } from "../../prisma/client";

export const createExpense = async (data: {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string;
  note?: string | null;
  date?: Date;
  userId: number;
}) => {
  const expense = await prisma.expense.create({
    data: {
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category ?? "Uncategorized",
      note: data.note ?? null,
      date: data.date ?? new Date(),
      user: { connect: { id: data.userId } }
    }
  });
  return expense;
};

export const getExpenses = async (userId: number, filters: any = {}) => {
  const where: any = { userId };
  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;
  if (filters.start || filters.end) {
    where.date = {};
    if (filters.start) where.date.gte = new Date(filters.start);
    if (filters.end) where.date.lte = new Date(filters.end);
  }
  return prisma.expense.findMany({ where, orderBy: { date: "desc" } });
};

export const deleteExpense = async (id: number, userId: number) => {
  // ensure owner
  const exp = await prisma.expense.findUnique({ where: { id } });
  if (!exp || exp.userId !== userId) throw new Error("Not found or unauthorized");
  return prisma.expense.delete({ where: { id } });
};

export const getExpenseById = async (id: number, userId: number) => {
  const exp = await prisma.expense.findUnique({ where: { id } });
  if (!exp || exp.userId !== userId) throw new Error("Not found or unauthorized");
  return exp;
};

// export const updateExpense = async (id: number, userId: number, data: Partial<{
//   title: string;
//   amount: number;
//   type: "INCOME" | "EXPENSE";
//   category: string;
//   note: string | null;
//   date: Date;
// }>) => {
//   // ensure owner
//   const exp = await prisma.expense.findUnique({ where: { id } });
//   if (!exp || exp.userId !== userId) throw new Error("Not found or unauthorized");
//   return prisma.expense.update({
//     where: { id },
//     data
//   });
// };