/*
 * application-state.test.ts
 *
 * Tests the application form state and API payload functions.
 * Author: Elijah, Jeremiah
 * Date Created: 11/3/2026
 */

import { describe, expect, test } from "@jest/globals";
import {
  emptyApplicationFormState,
  isMinor,
  buildPersonalInfoPayload,
  buildPositionsPayload,
  buildOnboardingPayload,
  buildAppointmentPayload,
  buildReviewData,
  firstStepWithMissingFields,
} from "./application-state";
import type { ApplicationFormState } from "./application-state";

// Creates a separate initial state for each test.
function makeState(): ApplicationFormState {
  return {
    personalInfo: { ...emptyApplicationFormState.personalInfo },
    proofOfResidenceUrl: "",
    positions: {
      ...emptyApplicationFormState.positions,
      positionIds: [],
      availableDays: [],
    },
    onboarding: { ...emptyApplicationFormState.onboarding },
    appointment: { ...emptyApplicationFormState.appointment },
  };
}

describe("isMinor", () => {
  test.each([
    ["17", true],
    ["18", false],
    ["34", false],
    ["", false],
    ["abc", false],
    ["17.5", false],
    ["0", false],
  ])("returns the correct result for age %s", (age, expected) => {
    const state = makeState();
    state.personalInfo.age = age;

    expect(isMinor(state)).toBe(expected);
  });
});

describe("buildPersonalInfoPayload", () => {
  test("converts age, joins names, and omits blank optional fields", () => {
    const state = makeState();

    state.personalInfo = {
      ...state.personalInfo,
      firstName: " Jane ",
      lastName: " Smith ",
      age: "17",
      email: " jane@example.com ",
      cellPhone: " 5551234567 ",
      homePhone: "   ",
      emergencyContactFirstName: " John ",
      emergencyContactLastName: " Smith ",
      emergencyContactRelationship: "",
    };

    state.proofOfResidenceUrl = " https://example.com/proof.pdf ";

    const payload = buildPersonalInfoPayload(state);

    expect(payload.age).toBe(17);
    expect(payload.firstName).toBe("Jane");
    expect(payload.lastName).toBe("Smith");
    expect(payload.email).toBe("jane@example.com");
    expect(payload.emergencyContactName).toBe("John Smith");
    expect(payload.proofOfResidenceUrl).toBe("https://example.com/proof.pdf");

    expect(payload).not.toHaveProperty("homePhone");
    expect(payload).not.toHaveProperty("emergencyContactRelationship");
  });

  test("includes optional fields when provided", () => {
    const state = makeState();

    state.personalInfo.homePhone = " 5551234567 ";
    state.personalInfo.emergencyContactRelationship = " Parent ";

    const payload = buildPersonalInfoPayload(state);

    expect(payload.homePhone).toBe("5551234567");
    expect(payload.emergencyContactRelationship).toBe("Parent");
  });
});

describe("buildPositionsPayload", () => {
  test("maps position IDs and includes disability details", () => {
    const state = makeState();

    state.positions = {
      positionIds: ["position-1", "position-2"],
      availableDays: ["MONDAY", "FRIDAY"],
      availableHours: " 9 AM to 5 PM ",
      hasDisability: true,
      disabilityDetails: " Some details ",
    };

    const payload = buildPositionsPayload(state);

    expect(payload.positions).toEqual(["position-1", "position-2"]);
    expect(payload.availableDays).toEqual(["MONDAY", "FRIDAY"]);
    expect(payload.availableHours).toBe("9 AM to 5 PM");
    expect(payload.hasDisability).toBe(true);
    expect(payload.disabilityDetails).toBe("Some details");
    expect(payload).not.toHaveProperty("positionIds");
  });

  test("omits disability details when hasDisability is false", () => {
    const state = makeState();

    state.positions.hasDisability = false;
    state.positions.disabilityDetails = "Old details";

    const payload = buildPositionsPayload(state);

    expect(payload.hasDisability).toBe(false);
    expect(payload).not.toHaveProperty("disabilityDetails");
  });

  test("omits blank disability details", () => {
    const state = makeState();

    state.positions.hasDisability = true;
    state.positions.disabilityDetails = "   ";

    const payload = buildPositionsPayload(state);

    expect(payload).not.toHaveProperty("disabilityDetails");
  });
});

describe("buildOnboardingPayload", () => {
  test("includes standard fields but omits minor fields for adults", () => {
    const state = makeState();

    state.personalInfo.age = "34";
    state.onboarding.waiverAccepted = false;
    state.onboarding.agreementAccepted = false;
    state.onboarding.waiverSignature = " Jane Smith ";
    state.onboarding.agreementSignature = " Jane Smith ";
    state.onboarding.minorReleaseAccepted = true;
    state.onboarding.minorGuardianSignature = " Parent Name ";
    state.onboarding.minorSignature = " Minor Name ";

    const payload = buildOnboardingPayload(state);

    expect(payload.waiverAccepted).toBe(false);
    expect(payload.agreementAccepted).toBe(false);
    expect(payload.waiverSignature).toBe("Jane Smith");
    expect(payload.agreementSignature).toBe("Jane Smith");

    expect(payload).not.toHaveProperty("minorReleaseAccepted");
    expect(payload).not.toHaveProperty("minorGuardianSignature");
    expect(payload).not.toHaveProperty("minorSignature");
  });

  test("includes minor release and signatures for minors", () => {
    const state = makeState();

    state.personalInfo.age = "17";
    state.onboarding.minorReleaseAccepted = true;
    state.onboarding.minorGuardianSignature = " Parent Name ";
    state.onboarding.minorSignature = " Minor Name ";

    const payload = buildOnboardingPayload(state);

    expect(payload.waiverAccepted).toBe(false);
    expect(payload.agreementAccepted).toBe(false);
    expect(payload.minorReleaseAccepted).toBe(true);
    expect(payload.minorGuardianSignature).toBe("Parent Name");
    expect(payload.minorSignature).toBe("Minor Name");
  });
});

describe("buildAppointmentPayload", () => {
  test("trims the availability", () => {
    const state = makeState();
    state.appointment.onboardingAvailability = "  Mondays after 3  ";

    expect(buildAppointmentPayload(state)).toEqual({
      onboardingAvailability: "Mondays after 3",
    });
  });
});

describe("buildReviewData", () => {
  const positions = [
    {
      id: "p1",
      name: "Guest Intake",
      description: "",
      days: "",
      times: "",
      available: true,
    },
    {
      id: "p2",
      name: "Translator",
      description: "",
      days: "",
      times: "",
      available: true,
    },
  ];

  test("maps ids to names, days to labels, and flags proof and minor", () => {
    const state = makeState();
    state.personalInfo.age = "16";
    state.personalInfo.emergencyContactFirstName = "John";
    state.personalInfo.emergencyContactLastName = "Doe";
    state.proofOfResidenceUrl = "https://example.com/proof.pdf";
    state.positions.positionIds = ["p2", "missing"];
    state.positions.availableDays = ["MONDAY", "FRIDAY"];
    state.positions.hasDisability = false;
    state.positions.disabilityDetails = "leftover";
    state.onboarding.minorSignature = " Kid ";

    const data = buildReviewData(state, positions);

    expect(data.positionNames).toEqual(["Translator"]);
    expect(data.availableDays).toEqual(["Monday", "Friday"]);
    expect(data.emergencyContactName).toBe("John Doe");
    expect(data.proofUploaded).toBe(true);
    expect(data.isMinor).toBe(true);
    expect(data.minorSignature).toBe("Kid");
    expect(data.disabilityDetails).toBe("");
  });

  test("blanks minor signatures for adults and proof when not uploaded", () => {
    const state = makeState();
    state.personalInfo.age = "30";
    state.onboarding.minorSignature = "Stale";

    const data = buildReviewData(state, positions);

    expect(data.isMinor).toBe(false);
    expect(data.minorSignature).toBe("");
    expect(data.proofUploaded).toBe(false);
  });
});

describe("firstStepWithMissingFields", () => {
  test.each([
    [["firstName"], 0],
    [["availableHours"], 1],
    [["waiverSignature", "minorSignature"], 2],
    [["onboardingAvailability"], 3],
    [["onboardingAvailability", "positions", "waiverAccepted"], 1],
    [["somethingElse"], null],
    [[], null],
  ])("%j -> %s", (fields, expected) => {
    expect(firstStepWithMissingFields(fields)).toBe(expected);
  });
});
