-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetOtpExpiry" TIMESTAMP(3);
