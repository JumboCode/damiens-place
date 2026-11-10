/*
 * application-state.ts
 *
 * Defines the application form state and builds payloads
 * for saving applicant information to the backend.
 * Author: Elijah, Jeremiah
 * Date Created: 11/3/2026
 */

import { emptyPersonalInfo, validatePersonalInfo } from "./personal-info";
import type { PersonalInfoValues } from "./personal-info";
import {
  DAY_OPTIONS,
  emptyPositionsStep,
  validatePositionsStep,
} from "./positions-step";
import type { Position, PositionsStepValues } from "./positions-step";
import { emptyOnboarding, validateOnboarding } from "./onboarding";
import type { OnboardingValues } from "./onboarding";
import {
  emptyAppointmentStep,
  validateAppointmentStep,
} from "./appointment-step";
import type { AppointmentStepValues } from "./appointment-step";
import { REVIEW_EDIT_STEPS } from "./review-step";
import type { ReviewData } from "./review-step";
import type { ApplicationDraft } from "@/lib/application-api";

// Every answer the shell holds, one section per step
export type ApplicationFormState = {
  personalInfo: PersonalInfoValues;
  proofOfResidenceUrl: string; // "" until a file is uploaded (set by PersonalInfoStep's onProofUploaded)
  positions: PositionsStepValues;
  onboarding: OnboardingValues;
  appointment: AppointmentStepValues;
};

export const emptyApplicationFormState: ApplicationFormState = {
  personalInfo: emptyPersonalInfo,
  proofOfResidenceUrl: "",
  positions: emptyPositionsStep,
  onboarding: emptyOnboarding,
  appointment: emptyAppointmentStep,
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

/**
 * buildAppointmentPayload
 *
 * Builds the body to send for Step 4 (PATCH).
 *
 * @param state - every answer the shell holds
 * @returns an object with `onboardingAvailability` (trimmed)
 */
export function buildAppointmentPayload(
  state: ApplicationFormState,
): Record<string, unknown> {
  return {
    onboardingAvailability: state.appointment.onboardingAvailability.trim(),
  };
}

/**
 * buildReviewData
 *
 * Turns the form state into the display form the review page shows: position names instead of ids,
 * "Monday" instead of "MONDAY", and a yes/no for whether the proof of residence was uploaded.
 *
 * @param state - every answer the shell holds
 * @param positions - the positions loaded from the API, used to look up each chosen id's name
 * @returns the data for ReviewStep. Position ids that aren't in `positions` are left out, and
 *   `disabilityDetails` is "" unless `hasDisability` is true
 */
export function buildReviewData(
  state: ApplicationFormState,
  positions: Position[],
): ReviewData {
  const { personalInfo, positions: picked, onboarding, appointment } = state;

  const positionNames = picked.positionIds.flatMap((id) => {
    const match = positions.find((position) => position.id === id);
    return match ? [match.name] : [];
  });

  const availableDays = picked.availableDays.map(
    (day) => DAY_OPTIONS.find((option) => option.value === day)?.label ?? day,
  );

  const minor = isMinor(state);

  return {
    firstName: personalInfo.firstName.trim(),
    lastName: personalInfo.lastName.trim(),
    age: personalInfo.age.trim(),
    email: personalInfo.email.trim(),
    cellPhone: personalInfo.cellPhone.trim(),
    homePhone: personalInfo.homePhone.trim(),
    street: personalInfo.street.trim(),
    city: personalInfo.city.trim(),
    state: personalInfo.state.trim(),
    zip: personalInfo.zip.trim(),
    emergencyContactName:
      `${personalInfo.emergencyContactFirstName.trim()} ${personalInfo.emergencyContactLastName.trim()}`.trim(),
    emergencyContactPhone: personalInfo.emergencyContactPhone.trim(),
    emergencyContactRelationship:
      personalInfo.emergencyContactRelationship.trim(),
    proofUploaded: state.proofOfResidenceUrl.trim() !== "",
    positionNames,
    availableDays,
    availableHours: picked.availableHours.trim(),
    hasDisability: picked.hasDisability,
    disabilityDetails:
      picked.hasDisability === true ? picked.disabilityDetails.trim() : "",
    waiverSignature: onboarding.waiverSignature.trim(),
    agreementSignature: onboarding.agreementSignature.trim(),
    isMinor: minor,
    minorGuardianSignature: minor
      ? onboarding.minorGuardianSignature.trim()
      : "",
    minorSignature: minor ? onboarding.minorSignature.trim() : "",
    onboardingAvailability: appointment.onboardingAvailability.trim(),
  };
}

// Which step each field the submit endpoint can report as missing belongs to
const PERSONAL_INFO_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "email",
  "cellPhone",
  "proofOfResidenceUrl",
  "street",
  "city",
  "state",
  "zip",
  "emergencyContactName",
  "emergencyContactPhone",
];
const POSITIONS_FIELDS = [
  "positions",
  "availableDays",
  "availableHours",
  "hasDisability",
];
const MATERIALS_FIELDS = [
  "waiverAccepted",
  "agreementAccepted",
  "waiverSignature",
  "agreementSignature",
  "minorReleaseAccepted",
  "minorGuardianSignature",
  "minorSignature",
];

/**
 * firstStepWithMissingFields
 *
 * Finds the earliest step that has a field the submit endpoint reported as missing (a 422's
 * `missingFields`), so the applicant can be sent back to fix it.
 *
 * @param missingFields - the field names from the 422 response
 * @returns the step number (0 to 3), or null if none of the names are recognized
 */
export function firstStepWithMissingFields(
  missingFields: string[],
): number | null {
  const stepOf = (field: string): number | null => {
    if (PERSONAL_INFO_FIELDS.includes(field))
      return REVIEW_EDIT_STEPS.personalInfo;
    if (POSITIONS_FIELDS.includes(field)) return REVIEW_EDIT_STEPS.positions;
    if (MATERIALS_FIELDS.includes(field)) return REVIEW_EDIT_STEPS.materials;
    if (field === "onboardingAvailability")
      return REVIEW_EDIT_STEPS.appointment;
    return null;
  };

  const found = missingFields
    .map(stepOf)
    .filter((step): step is number => step !== null);

  return found.length === 0 ? null : Math.min(...found);
}

// The step number of the Review page (the 5th step)
export const REVIEW_STEP_INDEX = 4;

/**
 * draftToFormState
 *
 * Converts a saved draft from the backend into the shape the shell uses for its state, so the applicant can continue,
 *
 * @param draft - the saved draft from the backend, with every field filled in (or null if unanswered)
 * @returns the application form state, with every field filled in (or "" for unanswered text fields, and false for unanswered checkboxes)
 */
export function draftToFormState(
  draft: ApplicationDraft,
): ApplicationFormState {
  // DONE: build the whole state, one section at a time.
  //   personalInfo: `age` goes from number to text, and emergencyContactName splits at the first space into first and last name
  //   positions: `positions` becomes `positionIds`
  //   onboarding: the checkboxes (null -> false) and the signatures (null -> "")
  //   appointment: onboardingAvailability
  //   Unanswered (null) becomes "", but hasDisability stays null

  const [emergencyContactFirstName, ...lastNameParts] =
    draft.emergencyContactName.split(" ");

  return {
    personalInfo: {
      firstName: draft.firstName,
      lastName: draft.lastName,
      age: draft.age.toString(),
      email: draft.email,
      cellPhone: draft.cellPhone,
      homePhone: draft.homePhone ?? "",
      street: draft.street,
      city: draft.city,
      state: draft.state,
      zip: draft.zip,
      emergencyContactFirstName: emergencyContactFirstName,
      emergencyContactLastName: lastNameParts.join(" "),
      emergencyContactPhone: draft.emergencyContactPhone,
      emergencyContactRelationship: draft.emergencyContactRelationship ?? "",
    },
    proofOfResidenceUrl: draft.proofOfResidenceUrl,
    positions: {
      positionIds: draft.positions,
      availableDays: draft.availableDays,
      availableHours: draft.availableHours ?? "",
      hasDisability: draft.hasDisability,
      disabilityDetails: draft.disabilityDetails ?? "",
    },
    onboarding: {
      waiverAccepted: draft.waiverAccepted ?? false, // the checkbox
      waiverSignature: draft.waiverSignature ?? "",
      agreementAccepted: draft.agreementAccepted ?? false, // the checkbox
      agreementSignature: draft.agreementSignature ?? "",
      minorReleaseAccepted: draft.minorReleaseAccepted ?? false, // the checkbox
      minorGuardianSignature: draft.minorGuardianSignature ?? "",
      minorSignature: draft.minorSignature ?? "",
    },
    appointment: {
      onboardingAvailability: draft.onboardingAvailability ?? "",
    },
  };
}

/**
 * firstIncompleteStep
 *
 * Checks each step of the application in order to find the first incomplete one.
 *
 * @param state - the current application form state.
 * @returns the index of the first incomplete step.
 */
export function firstIncompleteStep(state: ApplicationFormState): number {
  // DONE: the index of the first step whose checks fail, or REVIEW_STEP_INDEX if none:
  //   0: validatePersonalInfo, or proofOfResidenceUrl is ""   1: validatePositionsStep
  //   2: validateOnboarding (with isMinor(state))             3: validateAppointmentStep
  //Step 1
  if (
    Object.keys(validatePersonalInfo(state.personalInfo)).length > 0 ||
    state.proofOfResidenceUrl.trim() == ""
  ) {
    return 0;
  }
  if (Object.keys(validatePositionsStep(state.positions)).length > 0) {
    return 1;
  }
  if (
    Object.keys(validateOnboarding(state.onboarding, isMinor(state))).length > 0
  ) {
    return 2;
  }
  if (Object.keys(validateAppointmentStep(state.appointment)).length > 0) {
    return 3;
  }
  return REVIEW_STEP_INDEX;
}
