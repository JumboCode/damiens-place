/*
 * applicant-validation.ts
 *
 * Validates and normalizes applicant information submitted through
 * the application form.
 * Author: Elijah and Adrien
 * Date Created: 10/17/2026
 *
 */

import { DayOfWeek } from "../generated/prisma/enums";
import { normalizeEmail, normalizeCellPhone } from "./volunteer-identifiers";

// Fields that creating an applicant must include (these are what create the row)
const STEP_1_REQUIRED_FIELDS = [
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

// Fields that must be a non-empty string
const STRING_FIELDS = [
  "firstName",
  "lastName",
  "street",
  "city",
  "state",
  "zip",
  "emergencyContactName",
  "emergencyContactPhone",
  "emergencyContactRelationship",
  "homePhone",
  "proofOfResidenceUrl",
  "disabilityDetails",
  "availableHours",
  "waiverSignature",
  "agreementSignature",
  "minorGuardianSignature",
  "minorSignature",
  "onboardingAvailability",
];

// Fields that must be a boolean
const BOOLEAN_FIELDS = ["hasDisability"];

// Every field a client is allowed to send. Anything else gets rejected.
const ALLOWED_FIELDS = [
  ...STEP_1_REQUIRED_FIELDS,
  ...STRING_FIELDS,
  ...BOOLEAN_FIELDS,
  "positions",
  "availableDays",
];

/**
 * Validates applicant fields and normalizes email and cell phone values.
 *
 * @param body - The applicant data to validate.
 * @param options - Whether all required Step 1 fields must be present.
 * @returns An object containing cleaned data or an error message.
 */
export function validateApplicantFields(
  body: unknown,
  options: { requireStep1: boolean },
) {
  // The body must be a plain object, not null, an array, or a string
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    Object.getPrototypeOf(body) !== Object.prototype
  ) {
    return { error: "Body must be an object" };
  }
  const input = body as Record<string, unknown>;

  for (const field of Object.keys(input)) {
    if (!ALLOWED_FIELDS.includes(field)) {
      return { error: `${field} must be an allowed field` };
    }
  }

  if (options.requireStep1) {
    for (const field of STEP_1_REQUIRED_FIELDS) {
      if (input[field] === undefined) {
        return { error: `${field} is missing from required fields` };
      }
    }
  }

  // The cleaned-up values to return. Only fields that were sent end up here.
  const data: Record<string, unknown> = {};

  // Check each field that was sent, one at a time, and return at the first problem.
  for (const [field, value] of Object.entries(input)) {
    if (STRING_FIELDS.includes(field)) {
      // Blank fields look "filled in" but are useless to an admin, so trim first
      if (typeof value !== "string" || value.trim() === "") {
        return { error: `${field} must be a non-empty string` };
      }
      data[field] = value.trim();
    } else if (field === "email") {
      if (
        typeof value !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value))
      ) {
        return { error: "email must be a valid email address" };
      }
      data[field] = normalizeEmail(value);
    } else if (field === "cellPhone") {
      if (typeof value !== "string") {
        return { error: "cellPhone must be a string" };
      }
      const normalized = normalizeCellPhone(value);
      if (normalized.length < 10) {
        return { error: "cellPhone must have at least 10 digits" };
      }
      data[field] = normalized;
    } else if (field === "age") {
      if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 1 ||
        value > 130
      ) {
        return { error: "age must be a whole number from 1 to 130" };
      }
      data[field] = value;
    } else if (BOOLEAN_FIELDS.includes(field)) {
      if (typeof value !== "boolean") {
        return { error: `${field} must be a boolean` };
      }
      data[field] = value;
    } else if (field === "positions") {
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
        return { error: "positions must be an array of strings" };
      }
      if (new Set(value).size !== value.length) {
        return { error: "positions has a repeat" };
      }
      data[field] = value;
    } else if (field === "availableDays") {
      if (
        !Array.isArray(value) ||
        !value.every((day) =>
          Object.values(DayOfWeek).includes(day as DayOfWeek),
        )
      ) {
        return { error: "availableDays must be an array of valid days" };
      }
      data[field] = value;
    }
  }

  if (input.hasDisability !== true && input.disabilityDetails !== undefined) {
    return {
      error:
        "disabilityDetails can only be provided when hasDisability is true",
    };
  }

  return { data };
}
