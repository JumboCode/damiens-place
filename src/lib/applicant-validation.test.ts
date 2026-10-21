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
import { validateApplicantFields } from "./applicant-validation";

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
});
