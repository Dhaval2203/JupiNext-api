-- CreateEnum
CREATE TYPE "AdjustmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "TimeClock" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "workDate" DATE NOT NULL,
    "startWorkTime" TIMESTAMP(3) NOT NULL,
    "endWorkTime" TIMESTAMP(3),
    "totalBreakSeconds" INTEGER NOT NULL DEFAULT 0,
    "totalWorkSeconds" INTEGER NOT NULL DEFAULT 0,
    "requiredSeconds" INTEGER NOT NULL DEFAULT 28800,
    "shortageSeconds" INTEGER NOT NULL DEFAULT 0,
    "isLessThan8Hours" BOOLEAN NOT NULL DEFAULT false,
    "hasAdjustmentRequest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeClock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceAdjustment" (
    "id" SERIAL NOT NULL,
    "timeClockId" INTEGER NOT NULL,
    "employeeId" TEXT NOT NULL,
    "requestedSeconds" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "comment" TEXT,
    "status" "AdjustmentStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" INTEGER,

    CONSTRAINT "AttendanceAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeClock_employeeId_idx" ON "TimeClock"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "TimeClock_employeeId_workDate_key" ON "TimeClock"("employeeId", "workDate");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceAdjustment_timeClockId_key" ON "AttendanceAdjustment"("timeClockId");

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_employeeId_idx" ON "AttendanceAdjustment"("employeeId");

-- AddForeignKey
ALTER TABLE "TimeClock" ADD CONSTRAINT "TimeClock_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_timeClockId_fkey" FOREIGN KEY ("timeClockId") REFERENCES "TimeClock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
