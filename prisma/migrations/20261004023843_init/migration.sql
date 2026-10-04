-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AvailabilityFrequency" AS ENUM ('WEEKLY', 'MONTHLY', 'SEASONAL');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "times" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "status" "ApplicantStatus" NOT NULL DEFAULT 'DRAFT',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "homePhone" TEXT,
    "proofOfResidenceUrl" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "emergencyContactRelationship" TEXT,
    "generalAvailability" "AvailabilityFrequency",
    "daysPerMonth" INTEGER,
    "availableDays" "DayOfWeek"[] DEFAULT ARRAY[]::"DayOfWeek"[],
    "hasDisability" BOOLEAN,
    "disabilityDetails" TEXT,
    "materialsReviewedAt" TIMESTAMP(3),
    "photoConsent" BOOLEAN,
    "backgroundCheckAuthorized" BOOLEAN,
    "waiverAccepted" BOOLEAN,
    "agreementAccepted" BOOLEAN,
    "minorReleaseAccepted" BOOLEAN,
    "complianceAcceptedAt" TIMESTAMP(3),
    "appointmentId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedByClerkId" TEXT,
    "volunteerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "homePhone" TEXT,
    "photoUrl" TEXT,
    "photoConsent" BOOLEAN NOT NULL DEFAULT false,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "emergencyContactRelationship" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourLog" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "minutes" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HourLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PositionToVolunteer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PositionToVolunteer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ApplicantToPosition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApplicantToPosition_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_volunteerId_key" ON "Applicant"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_cellPhone_key" ON "Volunteer"("email", "cellPhone");

-- CreateIndex
CREATE INDEX "HourLog_volunteerId_idx" ON "HourLog"("volunteerId");

-- CreateIndex
CREATE INDEX "_PositionToVolunteer_B_index" ON "_PositionToVolunteer"("B");

-- CreateIndex
CREATE INDEX "_ApplicantToPosition_B_index" ON "_ApplicantToPosition"("B");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourLog" ADD CONSTRAINT "HourLog_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourLog" ADD CONSTRAINT "HourLog_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionToVolunteer" ADD CONSTRAINT "_PositionToVolunteer_A_fkey" FOREIGN KEY ("A") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionToVolunteer" ADD CONSTRAINT "_PositionToVolunteer_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicantToPosition" ADD CONSTRAINT "_ApplicantToPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicantToPosition" ADD CONSTRAINT "_ApplicantToPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
