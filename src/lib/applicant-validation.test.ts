/*
 * applicant-validation.test.ts
 *
 * Tests validation and normalization of applicant information submitted
 * through the application form.
 * Author: Elijah and Adrien
 * Date Created: 10/17/2026
 *
 */

import { describe, expect, it } from "@jest/globals";
import {
  validateApplicantFields,
  findMissingFields,
  ApplicantForCompleteness,
} from "./applicant-validation";

// A complete adult applicant. Each test copies it and changes one thing.
// `as` tells TypeScript to trust us, so we only list the fields the helper looks at.
const completeAdult = {
  firstName: "Jane",
  lastName: "Doe",
  age: 34,
  email: "jane@x.com",
  cellPhone: "6175550123",
  proofOfResidenceUrl: "test/proof.pdf",
  street: "1 Main St",
  city: "Medford",
  state: "MA",
  zip: "02155",
  emergencyContactName: "John Doe",
  emergencyContactPhone: "6175550124",
  homePhone: null,
  emergencyContactRelationship: null,
  positions: [{ id: "position-1" }],
  availableDays: ["THURSDAY"],
  availableHours: "Thursday 10am to 2pm",
  hasDisability: false,
  disabilityDetails: null,
  waiverAccepted: true,
  waiverSignature: "Jane Doe",
  agreementAccepted: true,
  agreementSignature: "Jane Doe",
  minorReleaseAccepted: null,
  minorGuardianSignature: null,
  minorSignature: null,
  onboardingAvailability: "Weekday mornings",
} as ApplicantForCompleteness;

describe("findMissingFields", () => {
  it("returns an empty list for a complete adult applicant", () => {
    expect(findMissingFields(completeAdult)).toEqual([]);
  });

  it("reports missing signatures by name", () => {
    const applicant = {
      ...completeAdult,
      waiverSignature: null,
      agreementSignature: " ",
    };
    expect(findMissingFields(applicant)).toEqual([
      "waiverSignature",
      "agreementSignature",
    ]);
  });

  it("reports waiverAccepted when false or null", () => {
    expect(
      findMissingFields({ ...completeAdult, waiverAccepted: false }),
    ).toContain("waiverAccepted");

    expect(
      findMissingFields({ ...completeAdult, waiverAccepted: null }),
    ).toContain("waiverAccepted");
  });

  it("reports agreementAccepted when false or null", () => {
    expect(
      findMissingFields({ ...completeAdult, agreementAccepted: false }),
    ).toContain("agreementAccepted");

    expect(
      findMissingFields({ ...completeAdult, agreementAccepted: null }),
    ).toContain("agreementAccepted");
  });

  it("does not report consent checkboxes when true", () => {
    const missing = findMissingFields({
      ...completeAdult,
      waiverAccepted: true,
      agreementAccepted: true,
    });

    expect(missing).not.toContain("waiverAccepted");
    expect(missing).not.toContain("agreementAccepted");
  });

  it("reports positions when there are none", () => {
    expect(findMissingFields({ ...completeAdult, positions: [] })).toContain(
      "positions",
    );
  });

  it("reports availableDays when there are none", () => {
    expect(
      findMissingFields({ ...completeAdult, availableDays: [] }),
    ).toContain("availableDays");
  });

  it("does not report hasDisability when false", () => {
    expect(
      findMissingFields({ ...completeAdult, hasDisability: false }),
    ).not.toContain("hasDisability");
  });

  it("reports hasDisability when null", () => {
    expect(
      findMissingFields({ ...completeAdult, hasDisability: null }),
    ).toContain("hasDisability");
  });

  it("reports all three minor consent fields for a 17-year-old without them", () => {
    const applicant = {
      ...completeAdult,
      age: 17,
      minorReleaseAccepted: null,
      minorGuardianSignature: null,
      minorSignature: null,
    };

    expect(findMissingFields(applicant)).toEqual(
      expect.arrayContaining([
        "minorReleaseAccepted",
        "minorGuardianSignature",
        "minorSignature",
      ]),
    );
  });

  it("accepts a 17-year-old with all three minor consent fields", () => {
    const applicant = {
      ...completeAdult,
      age: 17,
      minorReleaseAccepted: true,
      minorGuardianSignature: "John Doe",
      minorSignature: "Jane Doe",
    };

    expect(findMissingFields(applicant)).toEqual([]);
  });

  it("does not require minor consent fields for adults", () => {
    expect(findMissingFields(completeAdult)).toEqual([]);
  });

  it("reports missing onboardingAvailability", () => {
    expect(
      findMissingFields({
        ...completeAdult,
        onboardingAvailability: null,
      }),
    ).toContain("onboardingAvailability");
  });

  it("reports several missing fields together", () => {
    const applicant = {
      ...completeAdult,
      positions: [],
      availableDays: [],
      waiverSignature: null,
      onboardingAvailability: "",
    };

    expect(findMissingFields(applicant)).toEqual(
      expect.arrayContaining([
        "positions",
        "availableDays",
        "waiverSignature",
        "onboardingAvailability",
      ]),
    );
  });
});

// A complete, valid Step 1 body used for tests requiring all Step 1 fields.
const validStep1 = {
  firstName: "Jane",
  lastName: "Doe",
  age: 34,
  email: "jane@x.com",
  cellPhone: "6175550123",
  proofOfResidenceUrl: "test/proof.pdf",
  street: "1 Main St",
  city: "Medford",
  state: "MA",
  zip: "02155",
  emergencyContactName: "John Doe",
  emergencyContactPhone: "6175550124",
};

describe("validateApplicantFields", () => {
  it("accepts a complete Step 1 body and normalizes email and phone", () => {
    const result = validateApplicantFields(
      { ...validStep1, email: "  Jane@X.COM ", cellPhone: "(617) 555-0123" },
      { requireStep1: true },
    );
    expect(result).toEqual({
      data: expect.objectContaining({
        email: "jane@x.com",
        cellPhone: "6175550123",
      }),
    });
  });

  it("rejects a missing required field when requireStep1 is true", () => {
    const input: Record<string, unknown> = { ...validStep1 };
    delete input.firstName;

    const result = validateApplicantFields(input, { requireStep1: true });

    expect(result).toEqual({
      error: expect.stringContaining("firstName"),
    });
  });

  it("accepts a partial body when requireStep1 is false", () => {
    const result = validateApplicantFields(
      { city: " Medford " },
      { requireStep1: false },
    );

    expect(result).toEqual({
      data: { city: "Medford" },
    });
  });

  it("rejects a bad email", () => {
    const result = validateApplicantFields(
      { email: "invalid-email" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("email"),
    });
  });

  it("rejects a phone number with only 9 digits", () => {
    const result = validateApplicantFields(
      { cellPhone: "617555012" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("cellPhone"),
    });
  });

  it("rejects bad ages", () => {
    const invalidAges = [0, 131, "twelve", 12.5];

    for (const age of invalidAges) {
      const result = validateApplicantFields({ age }, { requireStep1: false });

      expect(result).toEqual({
        error: expect.stringContaining("age"),
      });
    }
  });

  it("rejects a text field that's only spaces", () => {
    const result = validateApplicantFields(
      { firstName: "   " },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("firstName"),
    });
  });

  it("rejects an unknown field", () => {
    const result = validateApplicantFields(
      { unknownField: "test" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("unknownField"),
    });
  });

  it("rejects a server-owned field like status", () => {
    const result = validateApplicantFields(
      { status: "APPROVED" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("status"),
    });
  });

  it("rejects a body that isn't an object (null)", () => {
    const result = validateApplicantFields(null, { requireStep1: false });

    expect(result).toEqual({
      error: expect.stringContaining("Body"),
    });
  });

  it("rejects a body that isn't an object (an array)", () => {
    const result = validateApplicantFields([], { requireStep1: false });

    expect(result).toEqual({
      error: expect.stringContaining("Body"),
    });
  });

  it("rejects a body that isn't an object (a string)", () => {
    const result = validateApplicantFields("test", { requireStep1: false });

    expect(result).toEqual({
      error: expect.stringContaining("Body"),
    });
  });

  it("rejects a repeated position", () => {
    const result = validateApplicantFields(
      { positions: ["position1", "position1"] },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("positions"),
    });
  });

  it("rejects positions that aren't strings", () => {
    const result = validateApplicantFields(
      { positions: ["position1", 123] },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("positions"),
    });
  });

  it("accepts many unique positions and an empty list", () => {
    const positions = [
      "position1",
      "position2",
      "position3",
      "position4",
      "position5",
    ];

    const result1 = validateApplicantFields(
      { positions },
      { requireStep1: false },
    );

    expect(result1).toEqual({
      data: { positions },
    });

    const result2 = validateApplicantFields(
      { positions: [] },
      { requireStep1: false },
    );

    expect(result2).toEqual({
      data: { positions: [] },
    });
  });

  it("rejects a yes/no field that isn't true or false", () => {
    const result = validateApplicantFields(
      { hasDisability: "yes" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("hasDisability"),
    });
  });

  it("rejects disabilityDetails without hasDisability: true", () => {
    const result = validateApplicantFields(
      { disabilityDetails: "Needs assistance" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("disabilityDetails"),
    });
  });

  it("accepts disabilityDetails when hasDisability is true", () => {
    const result = validateApplicantFields(
      {
        hasDisability: true,
        disabilityDetails: "Needs assistance",
      },
      { requireStep1: false },
    );

    expect(result).toEqual({
      data: {
        hasDisability: true,
        disabilityDetails: "Needs assistance",
      },
    });
  });

  it("accepts valid availableDays", () => {
    const result = validateApplicantFields(
      { availableDays: ["MONDAY", "WEDNESDAY"] },
      { requireStep1: false },
    );

    expect(result).toEqual({
      data: {
        availableDays: ["MONDAY", "WEDNESDAY"],
      },
    });
  });

  it("accepts an empty availableDays array", () => {
    const result = validateApplicantFields(
      { availableDays: [] },
      { requireStep1: false },
    );

    expect(result).toEqual({
      data: { availableDays: [] },
    });
  });

  it("rejects an invalid DayOfWeek value", () => {
    const result = validateApplicantFields(
      { availableDays: ["MONDAY", "DAY"] },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("availableDays"),
    });
  });

  it("rejects availableDays when it is not an array", () => {
    const result = validateApplicantFields(
      { availableDays: "MONDAY" },
      { requireStep1: false },
    );

    expect(result).toEqual({
      error: expect.stringContaining("availableDays"),
    });
  });
  // Add these inside describe("validateApplicantFields", ...) in
  // src/lib/applicant-validation.test.ts

  it.each(["waiverAccepted", "agreementAccepted", "minorReleaseAccepted"])(
    "accepts true or false for %s",
    (field) => {
      expect(
        validateApplicantFields({ [field]: true }, { requireStep1: false }),
      ).toEqual({ data: { [field]: true } });
      expect(
        validateApplicantFields({ [field]: false }, { requireStep1: false }),
      ).toEqual({ data: { [field]: false } });
    },
  );

  it.each(["waiverAccepted", "agreementAccepted", "minorReleaseAccepted"])(
    "rejects a non-boolean %s",
    (field) => {
      const result = validateApplicantFields(
        { [field]: "yes" },
        { requireStep1: false },
      );
      expect(result).toEqual({ error: expect.stringContaining(field) });
    },
  );

  it("rejects the removed minorGuardianPhoneNumber field", () => {
    const result = validateApplicantFields(
      { minorGuardianPhoneNumber: "6175550123" },
      { requireStep1: false },
    );
    expect(result).toEqual({
      error: expect.stringContaining("minorGuardianPhoneNumber"),
    });
  });

  it("rejects a repeated day in availableDays", () => {
    const result = validateApplicantFields(
      { availableDays: ["MONDAY", "MONDAY"] },
      { requireStep1: false },
    );
    expect(result).toEqual({ error: expect.stringContaining("availableDays") });
  });
});
