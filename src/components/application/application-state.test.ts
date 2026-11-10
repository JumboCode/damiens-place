/*
 * application-state.test.ts
 *
 * Tests the application form state and API payload functions.
 * Author: Elijah, Jeremiah
 * Date Created: 11/3/2026
 */

import { describe, expect, test, it } from "@jest/globals";
import {
  emptyApplicationFormState,
  isMinor,
  buildPersonalInfoPayload,
  buildPositionsPayload,
  buildOnboardingPayload,
  buildAppointmentPayload,
  buildReviewData,
  firstStepWithMissingFields,
  draftToFormState,
  firstIncompleteStep,
} from "./application-state";
import type { ApplicationFormState } from "./application-state";
import type { ApplicationDraft } from "@/lib/application-api";

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

// Lusia and Rim addition

// A draft with only Step 1 saved (like test-applicant-four)
const step1Draft: ApplicationDraft = {
  id: "draft-1",
  status: "DRAFT",
  firstName: "Jane",
  lastName: "Doe",
  age: 34,
  email: "jane@example.com",
  cellPhone: "6175550123",
  homePhone: null,
  proofOfResidenceUrl: "https://example.com/proof.pdf",
  street: "1 Main St",
  city: "Medford",
  state: "MA",
  zip: "02155",
  emergencyContactName: "John Doe",
  emergencyContactPhone: "6175550124",
  emergencyContactRelationship: null,
  positions: [],
  availableDays: [],
  availableHours: null,
  hasDisability: null,
  disabilityDetails: null,
  waiverAccepted: null,
  waiverSignature: null,
  agreementAccepted: null,
  agreementSignature: null,
  minorReleaseAccepted: null,
  minorGuardianSignature: null,
  minorSignature: null,
  onboardingAvailability: null,
};

// The same adult applicant with every step answered
const fullDraft: ApplicationDraft = {
  ...step1Draft,
  homePhone: "6175550199",
  emergencyContactRelationship: "Spouse",
  positions: ["position-1", "position-2"],
  availableDays: ["MONDAY", "WEDNESDAY"],
  availableHours: "Mornings, 9am to noon",
  hasDisability: true,
  disabilityDetails: "Needs a chair",
  waiverAccepted: true,
  waiverSignature: "Jane Doe",
  agreementAccepted: true,
  agreementSignature: "Jane Doe",
  onboardingAvailability: "Weekday afternoons",
};

describe("draftToFormState", () => {
  it("turns a Step 1 only draft into form state, with unanswered answers empty", () => {
    const state = draftToFormState(step1Draft);

    expect(state.personalInfo.age).toBe("34"); // text in the form, a number in the API
    expect(state.personalInfo.homePhone).toBe("");
    expect(state.proofOfResidenceUrl).toBe("https://example.com/proof.pdf");
    expect(state.positions.positionIds).toEqual([]);
    expect(state.positions.availableHours).toBe("");
    expect(state.positions.hasDisability).toBeNull();
    expect(state.onboarding.waiverAccepted).toBe(false);
    expect(state.onboarding.waiverSignature).toBe("");
    expect(state.appointment.onboardingAvailability).toBe("");
  });

  it("restores the answers from every step", () => {
    const state = draftToFormState(fullDraft);

    expect(state.personalInfo.homePhone).toBe("6175550199");
    expect(state.positions.positionIds).toEqual(["position-1", "position-2"]);
    expect(state.positions.availableDays).toEqual(["MONDAY", "WEDNESDAY"]);
    expect(state.positions.hasDisability).toBe(true);
    expect(state.positions.disabilityDetails).toBe("Needs a chair");
    expect(state.onboarding.waiverAccepted).toBe(true);
    expect(state.onboarding.agreementSignature).toBe("Jane Doe");
    expect(state.appointment.onboardingAvailability).toBe("Weekday afternoons");
  });

  it('keeps a saved "No" for disability as false, not as unanswered', () => {
    const state = draftToFormState({ ...fullDraft, hasDisability: false });
    expect(state.positions.hasDisability).toBe(false);
  });

  it("restores the minors consent", () => {
    const state = draftToFormState({
      ...fullDraft,
      age: 17,
      minorReleaseAccepted: true,
      minorGuardianSignature: "John Doe",
      minorSignature: "Janie Doe",
    });
    expect(state.onboarding.minorReleaseAccepted).toBe(true);
    expect(state.onboarding.minorGuardianSignature).toBe("John Doe");
    expect(state.onboarding.minorSignature).toBe("Janie Doe");
  });

  it("splits the emergency contact name into first and last name", () => {
    const state = draftToFormState({
      ...step1Draft,
      emergencyContactName: "Mary Shen",
    });
    expect(state.personalInfo).toMatchObject({
      emergencyContactFirstName: "Mary",
      emergencyContactLastName: "Shen",
    });
  });

  it("is the reverse of buildPersonalInfoPayload", () => {
    const payload = buildPersonalInfoPayload(draftToFormState(step1Draft));

    expect(payload).toMatchObject({
      firstName: "Jane",
      age: 34,
      emergencyContactName: "John Doe",
    });
    expect(payload).not.toHaveProperty("homePhone");
  });
});

describe("firstIncompleteStep", () => {
  it("starts at Step 1 for an empty form", () => {
    expect(firstIncompleteStep(emptyApplicationFormState)).toBe(0);
  });

  it("stays on Step 1 when the proof of residence is missing", () => {
    const state = draftToFormState({ ...fullDraft, proofOfResidenceUrl: "" });
    expect(firstIncompleteStep(state)).toBe(0);
  });

  it("goes to Step 2 when only Step 1 is done", () => {
    expect(firstIncompleteStep(draftToFormState(step1Draft))).toBe(1);
  });

  it("goes to Step 3 when Steps 1 and 2 are done", () => {
    const state = draftToFormState({
      ...fullDraft,
      waiverAccepted: null,
      waiverSignature: null,
      agreementAccepted: null,
      agreementSignature: null,
    });
    expect(firstIncompleteStep(state)).toBe(2);
  });

  it("returns the earliest incomplete step, even when a later step is done", () => {
    // Step 2 has no positions, but Steps 3 and 4 are filled in
    const state = draftToFormState({ ...fullDraft, positions: [] });
    expect(firstIncompleteStep(state)).toBe(1);
  });

  it("goes to the Review step when everything is done", () => {
    expect(firstIncompleteStep(draftToFormState(fullDraft))).toBe(4);
  });

  it("needs the minors consent for an applicant under 18", () => {
    const withoutMinorConsent = draftToFormState({ ...fullDraft, age: 17 });
    expect(firstIncompleteStep(withoutMinorConsent)).toBe(2);

    const withMinorConsent = draftToFormState({
      ...fullDraft,
      age: 17,
      minorReleaseAccepted: true,
      minorGuardianSignature: "John Doe",
      minorSignature: "Janie Doe",
    });
    expect(firstIncompleteStep(withMinorConsent)).toBe(4);
  });
});
