/**
 * hour-log.test.ts
 *
 * Tests for validateHourLogFields, including the daylight saving edges.
 * Written for America/New_York: in 2026, clocks spring forward on March 8 and
 * fall back on November 1. "Now" is fixed at Nov 5, 2026, 7:00 AM pantry time.
 *
 * Author: Natalie Phua
 * Date Created: 11/6/2026
 */
import { validateHourLogFields } from "./hour-log";

const VALID = {
  date: "2026-10-14",
  startTime: "09:00",
  endTime: "12:30",
  positionId: "pos-1",
  notes: "Stocked shelves",
};

type HourLogData = {
  positionId: string;
  startsAt: Date;
  endsAt: Date;
  minutes: number;
  notes: string | null;
};

// The valid result's data (fails the test if the body was rejected)
function ok(body: unknown) {
  const result = validateHourLogFields(body);
  expect(result).not.toHaveProperty("error");
  return (result as { data: HourLogData }).data;
}

// Fails the test unless the body was rejected with an error that names the field
function expectError(body: unknown, field: string) {
  const result = validateHourLogFields(body);
  expect(result).toHaveProperty("error");
  expect((result as { error: string }).error).toContain(field);
}

// TODO: BE-hour-log changes this to `describe` once validateHourLogFields is written
describe.skip("validateHourLogFields", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-05T12:00:00Z"));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  describe("valid entries", () => {
    it("converts pantry time to UTC and computes minutes (EDT)", () => {
      const data = ok(VALID);
      expect(data.startsAt.toISOString()).toBe("2026-10-14T13:00:00.000Z");
      expect(data.endsAt.toISOString()).toBe("2026-10-14T16:30:00.000Z");
      expect(data.minutes).toBe(210);
      expect(data.positionId).toBe("pos-1");
      expect(data.notes).toBe("Stocked shelves");
    });

    it("uses the winter offset (EST)", () => {
      const data = ok({ ...VALID, date: "2026-01-15" });
      expect(data.startsAt.toISOString()).toBe("2026-01-15T14:00:00.000Z");
    });

    it("trims positionId and notes", () => {
      const data = ok({ ...VALID, positionId: "  pos-1 ", notes: "  hi  " });
      expect(data.positionId).toBe("pos-1");
      expect(data.notes).toBe("hi");
    });

    it("makes notes null when missing, null, or only spaces", () => {
      const withoutNotes: Record<string, unknown> = { ...VALID };
      delete withoutNotes.notes;
      expect(ok(withoutNotes).notes).toBeNull();
      expect(ok({ ...VALID, notes: null }).notes).toBeNull();
      expect(ok({ ...VALID, notes: "   " }).notes).toBeNull();
    });

    it("allows an entry earlier today", () => {
      const data = ok({
        ...VALID,
        date: "2026-11-05",
        startTime: "05:00",
        endTime: "06:00",
      });
      expect(data.minutes).toBe(60);
    });
  });

  describe("daylight saving", () => {
    it("counts the real elapsed time across spring forward", () => {
      // 1:00 AM EST to 4:00 AM EDT on March 8 is only 2 hours
      const data = ok({
        ...VALID,
        date: "2026-03-08",
        startTime: "01:00",
        endTime: "04:00",
      });
      expect(data.startsAt.toISOString()).toBe("2026-03-08T06:00:00.000Z");
      expect(data.endsAt.toISOString()).toBe("2026-03-08T08:00:00.000Z");
      expect(data.minutes).toBe(120);
    });

    it("counts the real elapsed time across fall back", () => {
      // 12:30 AM EDT to 3:00 AM EST on November 1 is 3.5 hours
      const data = ok({
        ...VALID,
        date: "2026-11-01",
        startTime: "00:30",
        endTime: "03:00",
      });
      expect(data.startsAt.toISOString()).toBe("2026-11-01T04:30:00.000Z");
      expect(data.endsAt.toISOString()).toBe("2026-11-01T08:00:00.000Z");
      expect(data.minutes).toBe(210);
    });

    it("handles an ordinary entry on the fall back day (EST)", () => {
      const data = ok({
        ...VALID,
        date: "2026-11-01",
        startTime: "09:00",
        endTime: "12:00",
      });
      expect(data.startsAt.toISOString()).toBe("2026-11-01T14:00:00.000Z");
      expect(data.minutes).toBe(180);
    });
  });

  describe("bad dates and times", () => {
    it("rejects a bad date", () => {
      expectError({ ...VALID, date: "2026-13-45" }, "date");
      expectError({ ...VALID, date: "10/14/2026" }, "date");
      expectError({ ...VALID, date: "2026-02-30" }, "date");
    });

    it("rejects a bad start or end time", () => {
      expectError({ ...VALID, startTime: "9am" }, "startTime");
      expectError({ ...VALID, endTime: "25:00" }, "endTime");
    });

    it("rejects an end time equal to or before the start time", () => {
      expectError({ ...VALID, endTime: "09:00" }, "endTime");
      expectError({ ...VALID, endTime: "08:00" }, "endTime");
    });

    it("rejects a start in the future", () => {
      expectError({ ...VALID, date: "2026-11-06" }, "date");
      // Later today (it is 7:00 AM now)
      expectError(
        { ...VALID, date: "2026-11-05", startTime: "09:00", endTime: "10:00" },
        "date",
      );
    });
  });

  describe("required and unknown fields", () => {
    it.each(["date", "startTime", "endTime", "positionId"])(
      "rejects a missing %s",
      (field) => {
        const body: Record<string, unknown> = { ...VALID };
        delete body[field];
        expectError(body, field);
      },
    );

    it("rejects a blank or non-string positionId", () => {
      expectError({ ...VALID, positionId: "   " }, "positionId");
      expectError({ ...VALID, positionId: 5 }, "positionId");
    });

    it("rejects notes that aren't a string or null", () => {
      expectError({ ...VALID, notes: 5 }, "notes");
    });

    it("rejects minutes and unknown fields, naming the field", () => {
      expectError({ ...VALID, minutes: 60 }, "minutes");
      expectError({ ...VALID, volunteerId: "x" }, "volunteerId");
    });
  });

  describe("bodies that aren't objects", () => {
    it.each([null, [], "text", 5, undefined])(
      "returns an error for %p",
      (body) => {
        expect(validateHourLogFields(body)).toHaveProperty("error");
      },
    );

    it("returns an error for an empty object", () => {
      expect(validateHourLogFields({})).toHaveProperty("error");
    });

    it("never throws", () => {
      expect(() => validateHourLogFields({ ...VALID, date: {} })).not.toThrow();
      expect(() =>
        validateHourLogFields({ ...VALID, startTime: null }),
      ).not.toThrow();
    });
  });
});
