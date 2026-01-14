/*
  Warnings:

  - A unique constraint covering the columns `[displayOrder]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "displayOrder" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Job_displayOrder_key" ON "Job"("displayOrder");
