/**
 * applicants.ts
 *
 * Holds fake test applicants so devs can try the admin applicant endpoints
 * without waiting for the application form to be wired up.
 *
 * Author: Natalie Phua
 * Date Created: 10/15/2026
 */

import { ApplicantStatus } from "../../src/generated/prisma/enums";

// Only the fields Prisma requires are mandatory; everything else is optional.
export type SeedApplicant = {
  // Fixed ids let the seed script upsert (re-running it never creates duplicates)
  id: string;
  status: ApplicantStatus;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  cellPhone: string;
  proofOfResidenceUrl: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  submittedAt?: Date;

  // Optional fields, only filled in for Test One so the detail endpoint has more to show
  homePhone?: string;
  emergencyContactRelationship?: string;
  timeAvailability?: string;
  hasDisability?: boolean;
  materialsReviewedAt?: Date;
  waiverAccepted?: boolean;
  agreementAccepted?: boolean;
  complianceAcceptedAt?: Date;

  // Names of seeded positions to link to this applicant
  positionNames: string[];
};

// All of this data is fake
export const applicants: SeedApplicant[] = [
  {
    id: "test-applicant-one",
    status: ApplicantStatus.SUBMITTED,
    firstName: "Test",
    lastName: "One",
    age: 34,
    email: "test.one@example.com",
    cellPhone: "6175550101",
    homePhone: "6175550102",
    proofOfResidenceUrl: "proof-of-residence/test-one-utility-bill.pdf",
    street: "123 Example St",
    city: "Medford",
    state: "MA",
    zip: "02155",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550103",
    emergencyContactRelationship: "Friend",
    timeAvailability: "Thursdays and Saturdays, 7:30 AM to 12:00 PM",
    hasDisability: false,
    materialsReviewedAt: new Date("2026-10-10T14:00:00Z"),
    waiverAccepted: true,
    agreementAccepted: true,
    complianceAcceptedAt: new Date("2026-10-10T14:00:00Z"),
    submittedAt: new Date("2026-10-10T14:00:00Z"),
    positionNames: ["Guest Intake", "Translator"],
  },
  {
    id: "test-applicant-two",
    status: ApplicantStatus.SUBMITTED,
    firstName: "Test",
    lastName: "Two",
    age: 28,
    email: "test.two@example.com",
    cellPhone: "6175550201",
    proofOfResidenceUrl: "proof-of-residence/test-two-utility-bill.pdf",
    street: "456 Example Ave",
    city: "Somerville",
    state: "MA",
    zip: "02144",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550203",
    submittedAt: new Date("2026-10-12T14:00:00Z"),
    positionNames: [],
  },
  {
    id: "test-applicant-three",
    status: ApplicantStatus.REJECTED,
    firstName: "Test",
    lastName: "Three",
    age: 45,
    email: "test.three@example.com",
    cellPhone: "6175550301",
    proofOfResidenceUrl: "proof-of-residence/test-three-utility-bill.pdf",
    street: "789 Example Rd",
    city: "Malden",
    state: "MA",
    zip: "02148",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550303",
    submittedAt: new Date("2026-10-11T14:00:00Z"),
    positionNames: [],
  },
  {
    // A draft: still being filled out, so no submittedAt
    id: "test-applicant-four",
    status: ApplicantStatus.DRAFT,
    firstName: "Test",
    lastName: "Four",
    age: 52,
    email: "test.four@example.com",
    cellPhone: "6175550401",
    proofOfResidenceUrl: "proof-of-residence/test-four-utility-bill.pdf",
    street: "321 Example Ln",
    city: "Everett",
    state: "MA",
    zip: "02149",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550403",
    positionNames: [],
  },
];
