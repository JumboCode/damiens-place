/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `availableDays` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundCheckAuthorized` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `daysPerMonth` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `generalAvailability` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `photoConsent` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "appointmentId",
DROP COLUMN "availableDays",
DROP COLUMN "backgroundCheckAuthorized",
DROP COLUMN "daysPerMonth",
DROP COLUMN "generalAvailability",
DROP COLUMN "photoConsent",
ADD COLUMN     "minorGuardianName" TEXT,
ADD COLUMN     "minorGuardianPhoneNumber" TEXT,
ADD COLUMN     "onboardingAvailability" TEXT,
ADD COLUMN     "timeAvailability" TEXT;

-- DropTable
DROP TABLE "Appointment";

-- DropEnum
DROP TYPE "AvailabilityFrequency";
