import { prisma } from "../../prisma/client";

export const createOrUpdateBudget = async (userId: number, category: string, amount: number, month: string) => {
  const existing = await prisma.budget.findUnique({
    where: { userId_category_month: { userId, category, month } }
  });

  if (existing) {
    return prisma.budget.update({
      where: { id: existing.id },
      data: { amount }
    });
  }

  return prisma.budget.create({
    data: { userId, category, amount, month }
  });
};

export const getBudgets = async (userId: number, month: string) => {
  return prisma.budget.findMany({
    where: { userId, month }
  });
};

export const deleteBudget = async (id: number, userId: number) => {
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget || budget.userId !== userId) throw new Error("Not found or unauthorized");
  return prisma.budget.delete({ where: { id } });
};
