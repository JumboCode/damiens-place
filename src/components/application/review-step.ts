/**
 * review-step.ts
 *
 * Defines the data types used by the application review page.
 *
 * Author: Adrien and Luisa
 * Date Created: 11/03/2026
 */

// Everything the review page shows. It's already in display form: names instead of ids, and "Monday" instead of "MONDAY".
export type ReviewData = {
  // Personal info
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  cellPhone: string;
  homePhone: string; // "" if not given
  street: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string; // "" if not given
  proofUploaded: boolean;
  // Positions
  positionNames: string[];
  availableDays: string[];
  availableHours: string;
  hasDisability: boolean | null;
  disabilityDetails: string; // "" if none
  // Materials
  waiverSignature: string;
  agreementSignature: string;
  isMinor: boolean;
  minorGuardianSignature: string;
  minorSignature: string;
  // Appointment
  onboardingAvailability: string;
};

// The step number to send to onEdit for each section. These match the order of the steps in the application shell.
export const REVIEW_EDIT_STEPS = {
  personalInfo: 0,
  positions: 1,
  materials: 2,
  appointment: 3,
} as const;
