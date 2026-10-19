/*
  Warnings:

  - You are about to drop the column `agreementAccepted` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `minorGuardianName` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `minorReleaseAccepted` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `timeAvailability` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `waiverAccepted` on the `Applicant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "agreementAccepted",
DROP COLUMN "minorGuardianName",
DROP COLUMN "minorReleaseAccepted",
DROP COLUMN "timeAvailability",
DROP COLUMN "waiverAccepted",
ADD COLUMN     "agreementSignature" TEXT,
ADD COLUMN     "availableDays" "DayOfWeek"[],
ADD COLUMN     "availableHours" TEXT,
ADD COLUMN     "minorGuardianSignature" TEXT,
ADD COLUMN     "minorSignature" TEXT,
ADD COLUMN     "waiverSignature" TEXT;
