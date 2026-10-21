/**
 * applicants.ts
 *
 * Holds fake test applicants so devs can try the admin applicant endpoints
 * without waiting for the application form to be wired up.
 *
 * Author: Natalie Phua
 * Date Created: 10/15/2026
 */

import { ApplicantStatus, DayOfWeek } from "../../src/generated/prisma/enums";

// Only the fields Prisma requires are mandatory; everything else is optional.
export type SeedApplicant = {
  // Fixed ids let the seed script upsert (re-running it never creates
  // duplicates)
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

  // Optional fields, only filled in for Test One and Test Five so they have
  // more to show
  homePhone?: string;
  emergencyContactRelationship?: string;
  availableDays?: DayOfWeek[];
  availableHours?: string;
  hasDisability?: boolean;
  materialsReviewedAt?: Date;
  waiverSignature?: string;
  agreementSignature?: string;
  complianceAcceptedAt?: Date;
  onboardingAvailability?: string;

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
    availableDays: [DayOfWeek.THURSDAY, DayOfWeek.SATURDAY],
    availableHours: "7:30 AM to 12:00 PM. Happy to stay later if needed.",
    hasDisability: false,
    materialsReviewedAt: new Date("2026-10-10T14:00:00Z"),
    waiverSignature: "Test One",
    agreementSignature: "Test One",
    complianceAcceptedAt: new Date("2026-10-10T14:00:00Z"),
    onboardingAvailability: "Weekday mornings before 11 AM.",
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

  // Test Five to Seven are for the approve/reject ticket. Their submittedAt
  // dates are older than Test One, so the Applicant GET list order
  // (Two, Three, One) is unchanged.
  {
    // Approve this one: it has positions, so the copy into a Volunteer can
    // be checked
    id: "test-applicant-five",
    status: ApplicantStatus.SUBMITTED,
    firstName: "Test",
    lastName: "Five",
    age: 30,
    email: "test.five@example.com",
    cellPhone: "6175550501",
    homePhone: "6175550502",
    proofOfResidenceUrl: "proof-of-residence/test-five-utility-bill.pdf",
    street: "55 Example Blvd",
    city: "Medford",
    state: "MA",
    zip: "02155",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550503",
    emergencyContactRelationship: "Sibling",
    availableDays: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
    availableHours: "1:00 PM to 5:00 PM.",
    hasDisability: false,
    materialsReviewedAt: new Date("2026-10-09T14:00:00Z"),
    waiverSignature: "Test Five",
    agreementSignature: "Test Five",
    complianceAcceptedAt: new Date("2026-10-09T14:00:00Z"),
    onboardingAvailability: "Any weekday afternoon.",
    submittedAt: new Date("2026-10-09T14:00:00Z"),
    positionNames: ["Guest Intake", "Translator"],
  },
  {
    // Reject this one
    id: "test-applicant-six",
    status: ApplicantStatus.SUBMITTED,
    firstName: "Test",
    lastName: "Six",
    age: 41,
    email: "test.six@example.com",
    cellPhone: "6175550601",
    proofOfResidenceUrl: "proof-of-residence/test-six-utility-bill.pdf",
    street: "66 Example Way",
    city: "Arlington",
    state: "MA",
    zip: "02474",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550603",
    submittedAt: new Date("2026-10-08T14:00:00Z"),
    positionNames: [],
  },
  {
    // Same email and cell phone as Test Five on purpose: once Five is approved,
    // approving Seven must fail because that volunteer already exists
    id: "test-applicant-seven",
    status: ApplicantStatus.SUBMITTED,
    firstName: "Test",
    lastName: "Seven",
    age: 30,
    email: "test.five@example.com",
    cellPhone: "6175550501",
    proofOfResidenceUrl: "proof-of-residence/test-seven-utility-bill.pdf",
    street: "55 Example Blvd",
    city: "Medford",
    state: "MA",
    zip: "02155",
    emergencyContactName: "Test Contact",
    emergencyContactPhone: "6175550503",
    submittedAt: new Date("2026-10-07T14:00:00Z"),
    positionNames: [],
  },
];
