
/*
 * application-state.ts
 *
 * Defines the application form state and builds payloads
 * for saving applicant information to the backend.
 * Author: Elijah, Jeremiah
 * Date Created: 11/3/2026
 */

import { emptyPersonalInfo } from "./personal-info";
import type { PersonalInfoValues } from "./personal-info";
import { emptyPositionsStep } from "./positions-step";
import type { PositionsStepValues } from "./positions-step";
import { emptyOnboarding } from "./onboarding";
import type { OnboardingValues } from "./onboarding";

// Every answer the shell holds, one section per step
export type ApplicationFormState = {
  personalInfo: PersonalInfoValues;
  proofOfResidenceUrl: string; // "" until a file is uploaded (set by PersonalInfoStep's onProofUploaded)
  positions: PositionsStepValues;
  onboarding: OnboardingValues;
  // TODO(natalie): add the Step 4 answers here
};

export const emptyApplicationFormState: ApplicationFormState = {
  personalInfo: emptyPersonalInfo,
  proofOfResidenceUrl: "",
  positions: emptyPositionsStep,
  onboarding: emptyOnboarding,
};

/**
 * isMinor
 *
 * Tells whether the applicant is under 18, using the age typed in Step 1
 *
 * @param state - every answer the shell holds
 * @returns true if the age is a whole number from 1 to 17. False for 18 or older, and for a blank or
 *   invalid age 
 */
export function isMinor(state: ApplicationFormState): boolean {
  const ageText = state.personalInfo.age.trim();

  if (ageText === "") {
    return false;
  }

  const age = Number(ageText);

  return Number.isInteger(age) && age >= 1 && age < 18;
}

/**
 * buildPersonalInfoPayload
 *
 * Builds the body to send for Step 1 (POST the first time, PATCH after that). It turns the form's shape
 * into the API's shape, and leaves out blank optional fields because the API rejects empty strings.
 *
 * @param state - every answer the shell holds
 * @returns an object with the trimmed text answers (firstName, lastName, email, cellPhone, street, city,
 *   state, zip, emergencyContactPhone), `age` as a number, `emergencyContactName` (the emergency contact's
 *   first and last name joined with a space), and `proofOfResidenceUrl`. `homePhone` and
 *   `emergencyContactRelationship` are only included when they aren't blank
 */
export function buildPersonalInfoPayload(
  state: ApplicationFormState,
): Record<string, unknown> {
  const values = state.personalInfo;

  const payload: Record<string, unknown> = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    age: Number(values.age.trim()),
    email: values.email.trim(),
    cellPhone: values.cellPhone.trim(),
    street: values.street.trim(),
    city: values.city.trim(),
    state: values.state.trim(),
    zip: values.zip.trim(),
    emergencyContactName:
      `${values.emergencyContactFirstName.trim()} ${values.emergencyContactLastName.trim()}`.trim(),
    emergencyContactPhone: values.emergencyContactPhone.trim(),
    proofOfResidenceUrl: state.proofOfResidenceUrl.trim(),
  };

  const homePhone = values.homePhone.trim();

  if (homePhone !== "") {
    payload.homePhone = homePhone;
  }

  const relationship = values.emergencyContactRelationship.trim();

  if (relationship !== "") {
    payload.emergencyContactRelationship = relationship;
  }

  return payload;
}

/**
 * buildPositionsPayload
 *
 * Builds the body to send for Step 2 (PATCH). It renames `positionIds` to `positions`, which is what the
 * API expects, and only sends the disability details when they apply.
 *
 * @param state - every answer the shell holds
 * @returns an object with `positions` (the ids), `availableDays`, `availableHours` (trimmed), and
 *   `hasDisability`. `disabilityDetails` (trimmed) is only included when `hasDisability` is true and
 *   the details aren't blank
 */
export function buildPositionsPayload(
  state: ApplicationFormState,
): Record<string, unknown> {
  const values = state.positions;

  const payload: Record<string, unknown> = {
    positions: values.positionIds,
    availableDays: values.availableDays,
    availableHours: values.availableHours.trim(),
    hasDisability: values.hasDisability,
  };

  const disabilityDetails = values.disabilityDetails.trim();

  if (values.hasDisability === true && disabilityDetails !== "") {
    payload.disabilityDetails = disabilityDetails;
  }

  return payload;
}

/**
 * buildOnboardingPayload
 *
 * Builds the body to send for Step 3 (PATCH). The minor consent only applies to applicants under 18, so
 * it's left out for everyone else (the API would store it for an adult otherwise).
 *
 * @param state - every answer the shell holds
 * @returns an object with `waiverAccepted`, `waiverSignature`, `agreementAccepted`, and
 *   `agreementSignature` for everyone (the checkboxes as booleans, even when false, and the signatures
 *   trimmed). `minorReleaseAccepted`, `minorGuardianSignature`, and `minorSignature` are only included
 *   when isMinor(state) is true
 */
export function buildOnboardingPayload(
  state: ApplicationFormState,
): Record<string, unknown> {
  const values = state.onboarding;

  const payload: Record<string, unknown> = {
    waiverAccepted: values.waiverAccepted,
    waiverSignature: values.waiverSignature.trim(),
    agreementAccepted: values.agreementAccepted,
    agreementSignature: values.agreementSignature.trim(),
  };

  if (isMinor(state)) {
    payload.minorReleaseAccepted = values.minorReleaseAccepted;
    payload.minorGuardianSignature = values.minorGuardianSignature.trim();
    payload.minorSignature = values.minorSignature.trim();
  }

  return payload;
}
