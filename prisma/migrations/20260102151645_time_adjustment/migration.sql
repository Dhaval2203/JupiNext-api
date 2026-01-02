/*
  Warnings:

  - You are about to drop the column `employeeId` on the `AttendanceAdjustment` table. All the data in the column will be lost.
  - Added the required column `requestedByEmployeeId` to the `AttendanceAdjustment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceAdjustment" DROP CONSTRAINT "AttendanceAdjustment_employeeId_fkey";

-- AlterTable
ALTER TABLE "AttendanceAdjustment" DROP COLUMN "employeeId",
ADD COLUMN     "requestedByEmployeeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_requestedByEmployeeId_idx" ON "AttendanceAdjustment"("requestedByEmployeeId");

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_reviewedById_idx" ON "AttendanceAdjustment"("reviewedById");

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_status_idx" ON "AttendanceAdjustment"("status");

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_requestedByEmployeeId_fkey" FOREIGN KEY ("requestedByEmployeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
