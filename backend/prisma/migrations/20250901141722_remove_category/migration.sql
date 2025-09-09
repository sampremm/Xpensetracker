/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "public"."Category";
