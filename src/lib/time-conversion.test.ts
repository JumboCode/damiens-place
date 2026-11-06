/**
 * time-conversion.test.ts
 *
 * Tests for the pantry timezone helpers.
 *
 * Author: Natalie
 * Date Created: 11/5/2026
 */
import {
  formatMonth,
  formatPantry,
  pantryDateTimeToUtc,
  pantryMonthKey,
  pantryMonthRange,
  shiftMonth,
} from "./time-conversion";

describe("pantryDateTimeToUtc", () => {
  it("converts a summer time (EDT, UTC-4)", () => {
    expect(pantryDateTimeToUtc("2026-09-21", "16:05")?.toISOString()).toBe(
      "2026-09-21T20:05:00.000Z",
    );
  });

  it("converts a winter time (EST, UTC-5)", () => {
    expect(pantryDateTimeToUtc("2026-12-01", "09:00")?.toISOString()).toBe(
      "2026-12-01T14:00:00.000Z",
    );
  });

  it("moves a time that doesn't exist to the hour after the gap", () => {
    // 2:30am never happens on March 8, so it becomes 3:30am EDT
    expect(pantryDateTimeToUtc("2026-03-08", "02:30")?.toISOString()).toBe(
      "2026-03-08T07:30:00.000Z",
    );
  });

  it("uses the first one of a time that happens twice", () => {
    // 1:30am happens twice on November 1, and the first is EDT
    expect(pantryDateTimeToUtc("2026-11-01", "01:30")?.toISOString()).toBe(
      "2026-11-01T05:30:00.000Z",
    );
  });

  it("returns null for dates and times that aren't valid", () => {
    expect(pantryDateTimeToUtc("2026-02-30", "10:00")).toBeNull();
    expect(pantryDateTimeToUtc("2026-13-01", "10:00")).toBeNull();
    expect(pantryDateTimeToUtc("2026-9-21", "10:00")).toBeNull();
    expect(pantryDateTimeToUtc("2026-09-21", "24:00")).toBeNull();
    expect(pantryDateTimeToUtc("2026-09-21", "10:60")).toBeNull();
    expect(pantryDateTimeToUtc("2026-09-21", "9:00")).toBeNull();
  });
});

describe("formatPantry", () => {
  it("formats a date and time like the Figma", () => {
    expect(formatPantry("2026-09-21T20:05:00Z")).toBe("09/21/2026 04:05PM");
  });

  it("writes midnight as 12:00AM and noon as 12:00PM", () => {
    expect(formatPantry("2026-10-01T04:00:00Z")).toBe("10/01/2026 12:00AM");
    expect(formatPantry("2026-09-21T16:00:00Z")).toBe("09/21/2026 12:00PM");
  });

  it("uses the pantry's date when UTC is already the next day", () => {
    expect(formatPantry("2026-10-01T03:30:00Z")).toBe("09/30/2026 11:30PM");
  });

  it("throws a RangeError for an invalid date", () => {
    expect(() => formatPantry("nope")).toThrow(RangeError);
  });
});

describe("pantryMonthKey", () => {
  it("uses the pantry's timezone, not UTC", () => {
    expect(pantryMonthKey("2026-10-01T03:30:00Z")).toBe("2026-09");
  });

  it("starts a new month at pantry midnight", () => {
    expect(pantryMonthKey("2026-10-01T04:30:00Z")).toBe("2026-10");
  });

  it("handles the end of the year", () => {
    expect(pantryMonthKey("2027-01-01T04:30:00Z")).toBe("2026-12");
    expect(pantryMonthKey("2027-01-01T05:00:00Z")).toBe("2027-01");
  });
});

describe("pantryMonthRange", () => {
  it("gives the start and end of a summer month", () => {
    const range = pantryMonthRange("2026-09");
    expect(range?.start.toISOString()).toBe("2026-09-01T04:00:00.000Z");
    expect(range?.end.toISOString()).toBe("2026-10-01T04:00:00.000Z");
  });

  it("handles a month that ends when daylight saving does", () => {
    // November starts in EDT (UTC-4) and ends in EST (UTC-5)
    const range = pantryMonthRange("2026-11");
    expect(range?.start.toISOString()).toBe("2026-11-01T04:00:00.000Z");
    expect(range?.end.toISOString()).toBe("2026-12-01T05:00:00.000Z");
  });

  it("rolls December over into the next year", () => {
    expect(pantryMonthRange("2026-12")?.end.toISOString()).toBe(
      "2027-01-01T05:00:00.000Z",
    );
  });

  it("returns null for a month that isn't valid", () => {
    expect(pantryMonthRange("2026-13")).toBeNull();
    expect(pantryMonthRange("2026-00")).toBeNull();
    expect(pantryMonthRange("2026-9")).toBeNull();
  });
});

describe("shiftMonth", () => {
  it("moves back and forward within a year", () => {
    expect(shiftMonth("2026-10", -1)).toBe("2026-09");
    expect(shiftMonth("2026-10", 1)).toBe("2026-11");
  });

  it("crosses year ends", () => {
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2025-12", 1)).toBe("2026-01");
  });
});

describe("formatMonth", () => {
  it("formats the month like the Figma's selector", () => {
    expect(formatMonth("2026-09")).toBe("Sep 2026");
    expect(formatMonth("2026-12")).toBe("Dec 2026");
  });
});
